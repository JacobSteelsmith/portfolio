# AWS Amplify Deployment Guide

This document covers the manual steps required to deploy the Astro blog via AWS Amplify Hosting, connected to the GitHub repository `JacobSteelsmith/portfolio`.

## Prerequisites

- AWS account with Amplify access
- GitHub repository `JacobSteelsmith/portfolio` with the `main` branch
- Route 53 hosted zone for `steelsmith.org` already configured
- The `amplify.yml` build spec file committed to the repository root

## Step 1: Connect GitHub Repository to Amplify

1. Open the [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **New app** → **Host web app**
3. Select **GitHub** as the source provider and authorize AWS Amplify
4. Choose the repository `JacobSteelsmith/portfolio`
5. Select the `main` branch
6. Amplify will auto-detect the `amplify.yml` build spec from the repository root
7. Review the build settings and click **Save and deploy**

### Build Configuration

The `amplify.yml` in the repository root configures:
- **Node.js 22** via nvm (Astro requires >= 22.12.0)
- **Install**: `npm ci` for deterministic dependency installation
- **Build**: `npm run build` (runs `astro build`)
- **Output**: `dist/` directory containing the static site
- **Cache**: `node_modules/` cached between builds for faster installs

## Step 2: Configure Custom Domain

1. In the Amplify Console, navigate to your app
2. Go to **Hosting** → **Custom domains**
3. Click **Add domain**
4. Enter `steelsmith.org` — Amplify will detect the existing Route 53 hosted zone
5. Configure the subdomain: set `jacob` as the subdomain prefix
6. Remove any default root domain mapping if not needed
7. Click **Save**

Amplify will automatically:
- Create a CNAME or alias record in the Route 53 hosted zone pointing `jacob.steelsmith.org` to the Amplify app
- Provision and validate an SSL certificate via AWS Certificate Manager (ACM)
- Configure HTTPS for the custom domain

## Step 3: Verify HTTPS and SSL Certificate

1. After domain configuration, Amplify shows certificate status in the Custom domains section
2. Wait for the SSL certificate status to show **Available** (typically 5–30 minutes)
3. Verify the domain status shows **Available** with a green checkmark
4. Visit `https://jacob.steelsmith.org` in a browser
5. Confirm the padlock icon appears and the certificate is valid

### Troubleshooting SSL

- If certificate validation is pending for more than 30 minutes, check Route 53 for the CNAME validation records
- Ensure no conflicting DNS records exist for `jacob.steelsmith.org`
- The Route 53 hosted zone must be in the same AWS account as the Amplify app for automatic DNS validation

## Step 4: Verify Automatic Deployments

1. Push a commit to the `main` branch
2. In the Amplify Console, verify a new build is triggered automatically
3. Confirm the build completes successfully and the site is updated
4. Verify that pushes to other branches do NOT trigger builds (only `main` is connected)

## Step 5: Configure Build Notifications (Optional)

1. In the Amplify Console, go to **Notifications**
2. Add an email notification for build failures
3. This satisfies requirement 13.5 — failed builds retain the previous deployment and notify the owner

## Build Timeout

Amplify has a default build timeout of 30 minutes. The Astro build for 184 posts typically completes in under 5 minutes. No timeout adjustment should be needed.

## Architecture Notes

- **Phase 1 only**: Amplify Hosting is the deployment target for Phase 1
- **Phase 2**: The site will migrate to CloudFormation-managed S3 + CloudFront infrastructure
- Amplify handles SSL termination, CDN distribution, and atomic deployments automatically
- Each successful build creates a new deployment; failed builds do not affect the live site
