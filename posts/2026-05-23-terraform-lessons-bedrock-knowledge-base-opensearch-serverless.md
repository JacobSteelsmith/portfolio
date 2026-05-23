---
title: "Terraform Lessons: Bedrock Knowledge Base with OpenSearch Serverless"
date: 2026-05-23
---

Today I set up an Amazon Bedrock Knowledge Base backed by OpenSearch Serverless as part of a RAG (retrieval-augmented generation) chatbot I'm developing for my portfolio, and ran into a series of Terraform issues that taught me a lot about how these services fit together. Here's what I learned.

## MCP Servers for AWS and Terraform

I enabled two MCP (Model Context Protocol) servers in my IDE that gave my AI assistant direct access to AWS documentation and Terraform registry lookups. This made troubleshooting significantly faster since the assistant could look up provider schemas, resource docs, and AWS API details in real time rather than relying on potentially outdated training data.

The [AWS MCP Server](https://docs.aws.amazon.com/agent-toolkit/latest/userguide/getting-started-aws-mcp-server.html) provides tools for searching AWS documentation, checking regional availability, and even running AWS CLI commands. The Terraform MCP Server provides registry lookups for providers, modules, and resource documentation.

In Kiro, these are configured in `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "aws": {
      "command": "uvx",
      "args": ["awslabs.aws-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": []
    },
    "terraform": {
      "command": "npx",
      "args": ["-y", "@hashicorp/terraform-mcp-server"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

The AWS server requires `uvx` (from the `uv` Python package manager) and the Terraform server uses `npx`. Both run as local processes that the IDE communicates with — no cloud services or API keys needed beyond your existing AWS credentials.

## OpenSearch Serverless Requires Explicit Infrastructure

When configuring a Bedrock Knowledge Base with OpenSearch Serverless as the vector store, you can't just point it at a collection ARN and hope for the best. You need to create:

1. **An encryption policy** — required before the collection can be created
2. **A network policy** — controls whether the collection is publicly accessible or VPC-only
3. **A data access policy** — grants IAM principals permission to manage indexes and documents
4. **The collection itself** — with type `VECTORSEARCH`
5. **A vector index** — Bedrock does not create this for you

The collection won't provision without the encryption and network policies in place first, so `depends_on` ordering matters.

## The Vector Index Must Exist Before the Knowledge Base

Bedrock validates that the vector index exists when you create the knowledge base. If it doesn't find it, you get:

```
ValidationException: The knowledge base storage configuration provided is invalid...
no such index [bedrock-knowledge-base-default-index]
```

There's no native AWS Terraform resource for creating an OpenSearch Serverless index. The solution is the `opensearch-project/opensearch` provider with the `opensearch_index` resource. The index needs a knn_vector mapping that matches your embedding model's dimensions (1024 for Titan Embed Text v2).

## AOSS Uses a Different Signature Service

When configuring the opensearch provider for OpenSearch Serverless, you must set:

```hcl
aws_signature_service = "aoss"
```

Without this, the provider signs requests with the default `es` service scope, and the collection rejects them with a 403. This is easy to miss since the error doesn't clearly indicate a signing issue.

## AOSS Resource Names Have a 32-Character Limit

OpenSearch Serverless policy and collection names are capped at 32 characters. If your naming convention uses a long domain name (like `resume-jacob-steelsmith-org`), the suffixes push you over the limit. I solved this with a `locals` block using a short prefix:

```hcl
locals {
  aoss_name = "resume-kb"
}
```

## The OpenSearch Provider Doesn't Support `aws login` Credentials Directly

The `opensearch-project/opensearch` provider has its own credential chain that doesn't understand the credential type from `aws login`. The fix is to export credentials as standard environment variables before running Terraform:

```bash
eval "$(aws configure export-credentials --format env)"
terraform apply
```

This converts your session into `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` env vars that the provider recognizes. I created an apply.sh script to export these and then run terraform.

## CloudFront Certificates Must Be in us-east-1

CloudFront requires ACM certificates to be in `us-east-1`, regardless of where your other resources live. The standard Terraform pattern is an aliased provider:

```hcl
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

resource "aws_acm_certificate" "site" {
  provider    = aws.us_east_1
  domain_name = var.domain_name
  # ...
}
```

Don't move your entire stack to us-east-1 just for the cert. The alias creates a second provider *configuration* (not a new provider) that targets a different region.

## Changing a Resource's Provider Requires State Surgery

If you create a resource with one provider and later change the `provider` argument, Terraform won't detect the change in `plan`. The resource in state is still associated with the old provider. You need to remove it from state first:

```bash
terraform state rm aws_acm_certificate.site
```

This removes Terraform's *record* of the resource without deleting the actual infrastructure. After that, `plan` will show the resource being created fresh with the new provider. The old resource becomes orphaned in AWS and should be cleaned up manually.

## Provider Aliases Are for Multi-Region/Multi-Account, Not Multi-Environment

Aliased providers are for when you need two regions or two accounts *in the same deployment*. They're not a substitute for environment separation. For dev/staging/prod, use separate workspaces or tfvars with isolated state files. Mixing environments in one state file defeats the isolation you want.

## `terraform init` Downloads Providers

Running `terraform init` downloads provider plugins into `.terraform/providers/`. The `.terraform.lock.hcl` file pins exact versions and checksums. The `.terraform/` directory is like `node_modules` — it belongs in `.gitignore`, not in version control.

## The IAM Role Needs AOSS Permissions

The Bedrock Knowledge Base IAM role needs `aoss:APIAccessAll` on the collection ARN, in addition to S3 and Bedrock model permissions. Without it, Bedrock can't read or write vectors to the collection even if the data access policy allows it — both IAM and the AOSS data access policy must grant access.

## GitHub Actions OIDC: Environment Changes the Subject Claim

This one cost me time. When a GitHub Actions job declares `environment: production`, the OIDC token's `sub` claim changes from the branch-based format to an environment-based one:

- Without environment: `repo:owner/repo:ref:refs/heads/master`
- With environment: `repo:owner/repo:environment:production`

The IAM trust policy must include all subject patterns your workflows will use. For a setup with both PR validation and production deploys:

```hcl
github_subjects = [
  "org/repo:ref:refs/heads/master",
  "org/repo:pull_request",
  "org/repo:environment:production",
]
```

I debugged this by adding a step that decoded the OIDC token's JWT payload to see the actual `sub` claim GitHub was sending. The trust policy looked correct for branch-based subjects, but the environment override was the real value being sent.

## GitHub Actions Secrets: Repository vs Environment Scope

GitHub Actions secrets can be scoped to a repository or to a specific environment. If a job doesn't declare `environment:`, it can only access repository-level secrets — not environment-scoped ones. This matters for OIDC role ARNs that need to be available to both PR validation jobs (no environment) and deploy jobs (with environment).

Terraform can manage both with `github_actions_secret` (repo-level) and `github_actions_environment_secret` (environment-scoped).

## The `unfunco/oidc-github` Module Defaults to `main`

The `unfunco/oidc-github/aws` Terraform module has a `default_subject` that appends `ref:refs/heads/main` to bare repository entries. If your default branch is `master`, a bare entry like `"org/repo"` won't match. Always use explicit subject suffixes to avoid ambiguity.

## CloudFront `default_root_object` Only Works for the Root Path

CloudFront's `default_root_object = "index.html"` only applies to requests for `/` — it does NOT rewrite `/resume` to `/resume/index.html`. This is a well-known limitation that catches everyone deploying static sites with clean URLs.

The fix is a CloudFront Function attached to `viewer-request` that appends `/index.html` to paths without file extensions:

```hcl
resource "aws_cloudfront_function" "directory_index" {
  name    = "dir-index"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-EOF
    function handler(event) {
      var request = event.request;
      var uri = request.uri;
      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      } else if (!uri.includes('.')) {
        request.uri += '/index.html';
      }
      return request;
    }
  EOF
}
```

## Content Security Policy Must Account for Astro's Inline Code

Astro generates inline `<style>` and `<script>` tags by default. A strict CSP of `default-src 'self'` will block these. You need:

```
style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'
```

Also make sure `connect-src` references the correct region for your API Gateway. I had it pointing to `us-east-1` when my API was in `us-west-2`.

## Build-Time Environment Variables Need the Right Job Context

Astro uses `PUBLIC_*` environment variables at build time — they're baked into the static output. If the variable comes from a GitHub environment (like `production`), the build step must run inside a job that declares that environment. Otherwise the variable is empty and the built site won't have the API URL.

I solved this by rebuilding the site inside the deploy job which has access to the `production` environment variables, passing `PUBLIC_CHAT_API_URL` as an env var to the build command.

## CORS with AWS_PROXY Requires Lambda to Return Headers

When using API Gateway's `AWS_PROXY` integration type, the gateway is a pure passthrough — it does not modify the response. This means your Lambda function must include CORS headers in every response:

```js
headers: {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
}
```

The OPTIONS preflight can still be handled by a MOCK integration at the API Gateway level, but the actual POST/GET responses must come from the Lambda with headers included. If you forget this, the browser blocks the response even though the request succeeded server-side.

## Bedrock Models Get Marked as Legacy

AWS marks older foundation models as "Legacy" and blocks access if you haven't used them in the last 30 days. I configured `anthropic.claude-3-haiku-20240307-v1:0` as my model, but by the time I got the knowledge base working, the model had been deprecated:

```
Access denied. This Model is marked by provider as Legacy and you have
not been actively using the model in the last 30 days.
```

The fix was switching to `anthropic.claude-haiku-4-5-20251001-v1:0` (Claude Haiku 4.5) in my `terraform.tfvars`. Lesson: check model availability status before committing to a model ID, and use the Bedrock `ListFoundationModels` API to find active alternatives.

## The OpenSearch Index Resource Is Fragile

The `opensearch_index` resource from the `opensearch-project/opensearch` provider has quirks:

1. **Mappings drift** — OpenSearch returns extra metadata in the mappings that doesn't match your Terraform config exactly, causing the provider to detect "changes" and want to replace the index on every apply.

2. **Replace means destroy + create** — Index settings like shard count can't be changed in-place, so any detected change triggers a full replacement. If the destroy step fails or is skipped, the create fails with `resource_already_exists_exception`.

3. **State surgery required** — When you hit the "already exists" error, you need to remove from state and re-import:
   ```bash
   terraform state rm opensearch_index.kb_vector
   terraform import opensearch_index.kb_vector bedrock-knowledge-base-default-index
   ```

The fix for drift is `lifecycle { ignore_changes = [mappings] }` which tells Terraform to stop comparing the mappings field after initial creation. The index schema rarely needs to change once set up.

## Knowledge Base Needs Data — Don't Forget Ingestion

Creating the knowledge base infrastructure (collection, index, KB resource, data source) is only half the job. The knowledge base will return empty or generic "I can't help" responses until you:

1. Upload documents to the S3 data source bucket
2. Trigger an ingestion job via `aws bedrock-agent start-ingestion-job`

I added both steps to the GitHub Actions deploy pipeline so the knowledge base content stays in sync with the repository automatically on every push.
