---
title: Architecture
description: Technical architecture of Jacob Steelsmith's portfolio site and resume site, showcasing two different AWS deployment approaches.
---

# Architecture

These two sites demonstrate different AWS deployment strategies — one using managed hosting (Amplify) and the other using full infrastructure-as-code (Terraform). Together they showcase the tradeoffs between simplicity and control.

## Portfolio Site (jacob.steelsmith.org)

The portfolio and blog site uses AWS Amplify for a managed, low-maintenance deployment.

### Stack

- **Framework**: Astro (static site generation)
- **Hosting**: AWS Amplify
- **CI/CD**: Amplify auto-builds on Git push
- **Domain**: Route 53 + Amplify managed SSL

### How It Works

1. Content is authored as Markdown files in the `posts/` directory
2. Astro builds static HTML at build time with zero client-side JavaScript
3. Amplify detects pushes to the repository and triggers a build
4. Built assets are deployed to Amplify's global CDN

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting | AWS Amplify | Minimal ops overhead, built-in CI/CD, managed SSL |
| Framework | Astro | Zero-JS output, fast builds, Markdown-native |
| Content | Markdown files | No CMS dependency, version-controlled, portable |

---

## Resume Site (resume.jacob.steelsmith.org)

The resume site uses Terraform to manage all infrastructure as code, demonstrating full control over AWS resources and a RAG-powered AI chatbot.

### Stack

- **Framework**: Astro (static site generation)
- **Hosting**: S3 + CloudFront
- **IaC**: Terraform (single root module)
- **CI/CD**: GitHub Actions with OIDC authentication
- **AI**: Amazon Bedrock Knowledge Base + Lambda

### Static Site Layer

- S3 bucket with CloudFront CDN distribution
- Origin Access Control (OAC) restricts S3 to CloudFront-only access
- CloudFront Function rewrites directory paths to `index.html`
- Security headers via CloudFront response headers policy (HSTS, CSP, X-Frame-Options)
- ACM certificate in us-east-1 (required by CloudFront) via aliased Terraform provider
- HTTP/2 and HTTP/3 enabled

### RAG Chatbot

- **Knowledge Base**: Amazon Bedrock with Titan Text Embeddings V2 (1024 dimensions)
- **Vector Store**: S3 Vectors
- **Generation**: Claude Haiku 4.5 via cross-region inference profile
- **API**: API Gateway (REST) → Lambda → Bedrock RetrieveAndGenerate
- **Rate Limiting**: WAF (10 req/min per-IP) + API Gateway usage plan (100 req/min global)
- **Data Source**: S3 bucket with Markdown documents, auto-ingested on deploy

### CI/CD Pipeline

1. Push to `master` triggers GitHub Actions
2. OIDC authenticates to AWS (no stored credentials)
3. Astro site builds with `PUBLIC_CHAT_API_URL` injected
4. Static assets sync to S3
5. Lambda function code is zipped and deployed
6. Knowledge base content syncs to S3 and ingestion job starts
7. CloudFront cache is invalidated

### Infrastructure as Code

All resources are managed in a single Terraform root module:

- **AWS resources**: S3, CloudFront, ACM, Route 53, API Gateway, Lambda, WAF, Bedrock Knowledge Base, OpenSearch Serverless, IAM roles/policies
- **GitHub resources**: OIDC provider, branch protection, Actions secrets and environment variables
- **OpenSearch resources**: Vector index (via `opensearch-project/opensearch` provider)
- **State**: S3 backend with lock file

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| IaC tool | Terraform | Single state file, unified workflow, declarative |
| Hosting | S3 + CloudFront | Full control, global CDN, cost-effective |
| Auth | OIDC (no stored keys) | Short-lived credentials, no secret rotation |
| Vector store | OpenSearch Serverless | Managed scaling, Bedrock-native integration |
| Rate limiting | WAF + API Gateway | Per-IP via WAF, global via usage plans |
| Model access | Inference profile | Cross-region routing, future-proof |

---

## Comparison

| Aspect | Portfolio (Amplify) | Resume (Terraform) |
|--------|--------------------|--------------------|
| Deployment | Git push → auto-build | Git push → GitHub Actions pipeline |
| Infrastructure | Fully managed | Fully codified |
| SSL | Amplify-managed | ACM + aliased provider |
| CDN | Amplify CDN | CloudFront |
| Ops overhead | Minimal | Moderate (state management, IAM) |
| Flexibility | Limited | Full control |
| AI features | None | RAG chatbot |
| Cost | Amplify free tier | Pay-per-use (S3, Lambda, Bedrock) |

Both approaches are valid. Amplify is ideal for content sites where you want to focus on writing. Terraform is the right choice when you need fine-grained control, custom integrations, or want to demonstrate infrastructure expertise.
