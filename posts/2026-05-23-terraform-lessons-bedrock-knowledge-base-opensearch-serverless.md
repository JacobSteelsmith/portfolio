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
