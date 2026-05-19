# Phase 2 Deployment Guide

This document covers deploying the production infrastructure that replaces AWS Amplify with S3 + CloudFront, managed via CloudFormation and Terraform.

## Prerequisites

- AWS CLI configured with credentials that have admin access (for initial setup)
- Terraform >= 1.5.0 installed
- GitHub personal access token with `repo` and `admin:org` scopes (for Terraform GitHub provider)
- The Route 53 hosted zone for `steelsmith.org` already exists
- Know your Route 53 hosted zone ID (find it in the AWS console under Route 53 → Hosted zones)

## Deployment Order

The infrastructure must be deployed in this order because Terraform depends on CloudFormation outputs:

1. Create Terraform state backend (one-time)
2. Deploy CloudFormation stack
3. Apply Terraform configuration
4. Verify the pipeline works

---

## Step 1: Create Terraform State Backend (One-Time)

Terraform needs an S3 bucket and DynamoDB table for remote state. Create these manually or via a separate CloudFormation stack:

```bash
# Create the state bucket
aws s3api create-bucket \
  --bucket jacobsteelsmith-terraform-state \
  --region us-east-1

# Enable versioning on the state bucket
aws s3api put-bucket-versioning \
  --bucket jacobsteelsmith-terraform-state \
  --versioning-configuration Status=Enabled

# Create the lock table
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

## Step 2: Deploy CloudFormation Stack

The stack must be deployed in **us-east-1** because ACM certificates for CloudFront require that region.

```bash
aws cloudformation deploy \
  --template-file infrastructure/template.yaml \
  --stack-name portfolio-site \
  --parameter-overrides \
    DomainName=jacob.steelsmith.org \
    HostedZoneId=YOUR_HOSTED_ZONE_ID \
    Environment=production \
  --region us-east-1 \
  --capabilities CAPABILITY_IAM
```

Replace `YOUR_HOSTED_ZONE_ID` with your actual Route 53 hosted zone ID for `steelsmith.org`.

### Wait for Certificate Validation

The ACM certificate uses DNS validation. Since the hosted zone is in the same account, CloudFormation will automatically create the validation CNAME record. However, certificate issuance can take 5–30 minutes.

Monitor progress:

```bash
aws cloudformation describe-stack-events \
  --stack-name portfolio-site \
  --region us-east-1 \
  --query 'StackEvents[?ResourceType==`AWS::CertificateManager::Certificate`].[LogicalResourceId,ResourceStatus]' \
  --output table
```

### Get Stack Outputs

Once the stack completes, retrieve the outputs needed for Terraform:

```bash
aws cloudformation describe-stacks \
  --stack-name portfolio-site \
  --region us-east-1 \
  --query 'Stacks[0].Outputs' \
  --output table
```

Note the values for:
- `BucketName` — e.g., `jacob.steelsmith.org-production`
- `DistributionId` — e.g., `E1ABC2DEF3GHIJ`
- `DistributionDomainName` — e.g., `d1234abcdef.cloudfront.net`

## Step 3: Apply Terraform Configuration

### Create terraform.tfvars

```bash
cd infrastructure/terraform

cat > terraform.tfvars << 'EOF'
s3_bucket_name             = "jacob.steelsmith.org-production"
cloudfront_distribution_id = "E1ABC2DEF3GHIJ"
aws_account_id             = "123456789012"
github_repository          = "JacobSteelsmith/portfolio"
environment                = "production"
EOF
```

Replace the values with your actual CloudFormation outputs and AWS account ID.

### Set GitHub Token

The GitHub provider needs a token:

```bash
export GITHUB_TOKEN="ghp_your_personal_access_token"
```

### Initialize and Apply

```bash
terraform init
terraform plan
terraform apply
```

This will:
- Create the IAM OIDC identity provider for GitHub Actions
- Create the IAM role with least-privilege deploy permissions
- Configure branch protection on `main` (require PR review + passing CI)
- Set GitHub Actions environment secrets (`AWS_ACCOUNT_ID`, `OIDC_ROLE_ARN`)
- Set GitHub Actions environment variables (`S3_BUCKET_NAME`, `CLOUDFRONT_DIST_ID`)

## Step 4: Create GitHub Environments

Before the workflow can run, create the environments in GitHub:

1. Go to **Settings → Environments** in the repository
2. Create a `production` environment
3. Create a `preview` environment (for PR deployments)

Terraform will populate the secrets and variables, but the environments must exist first. If Terraform fails on the environment resources, create them manually in GitHub first, then re-run `terraform apply`.

## Step 5: Verify the Pipeline

Push a commit to `main` and verify:

1. The GitHub Actions workflow triggers
2. The build job succeeds
3. The deploy-production job assumes the OIDC role
4. Files are synced to S3
5. CloudFront invalidation completes
6. The site is live at `https://jacob.steelsmith.org`

```bash
# Check the site responds
curl -I https://jacob.steelsmith.org

# Verify security headers
curl -sI https://jacob.steelsmith.org | grep -i 'strict-transport\|x-content-type\|x-frame-options\|content-security-policy'
```

## Step 6: Decommission Amplify (After Verification)

Once the CloudFront deployment is confirmed working:

1. In the Amplify Console, disconnect the app from the repository
2. Delete the Amplify app
3. Remove `amplify.yml` from the repository (optional — it's harmless to keep)

**Important:** Don't delete Amplify until you've confirmed the CloudFront site is serving correctly with valid HTTPS. The DNS cutover happens automatically when the Route 53 records point to CloudFront instead of Amplify.

---

## Preview Deployments (Pull Requests)

For PR preview deployments to work, you need a separate CloudFormation stack:

```bash
aws cloudformation deploy \
  --template-file infrastructure/template.yaml \
  --stack-name portfolio-site-preview \
  --parameter-overrides \
    DomainName=preview.jacob.steelsmith.org \
    HostedZoneId=YOUR_HOSTED_ZONE_ID \
    Environment=preview \
  --region us-east-1 \
  --capabilities CAPABILITY_IAM
```

Then add the preview stack outputs to the `preview` GitHub environment variables via Terraform or manually.

---

## Troubleshooting

### CloudFormation stack stuck on certificate validation

The ACM certificate needs DNS validation. If the stack is stuck at `CREATE_IN_PROGRESS` on the Certificate resource:
- Check Route 53 for the CNAME validation record
- Ensure no conflicting records exist
- Wait up to 30 minutes — DNS propagation can be slow

### OIDC role assumption fails in GitHub Actions

- Verify the OIDC provider exists: `aws iam list-open-id-connect-providers`
- Check the trust policy allows the correct repository: `aws iam get-role --role-name GitHubActionsPortfolioDeploy`
- Ensure the workflow has `permissions: id-token: write`
- Confirm the environment name in the workflow matches what Terraform configured

### S3 sync succeeds but site shows old content

CloudFront caches aggressively. The workflow creates an invalidation, but it can take 1–2 minutes to propagate globally. If content is still stale after 5 minutes:

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

### 403 errors on page paths

CloudFront is configured to return `/index.html` for 403/404 errors. If you're seeing raw 403s, the custom error response may not be configured correctly. Check the distribution settings in the AWS console.

---

## Architecture Summary

```
GitHub (push to main)
  → GitHub Actions (build + OIDC auth)
    → S3 (sync static files)
    → CloudFront (invalidate cache)

Visitor
  → Route 53 (DNS alias)
    → CloudFront (TLS + cache + security headers)
      → S3 (origin via OAC)
```
