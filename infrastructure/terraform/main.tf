terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }

  backend "s3" {
    bucket         = "jacobsteelsmith-terraform-state"
    key            = "portfolio/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

provider "github" {
  owner = split("/", var.github_repository)[0]
}

# -------------------------------------------------------------------
# IAM OIDC Provider for GitHub Actions
# -------------------------------------------------------------------

module "oidc_github" {
  source  = "unfunco/oidc-github/aws"
  version = "~> 3.0"

  github_subjects = [var.github_repository]

  iam_role_name = "GitHubActionsPortfolioDeploy"

  iam_role_inline_policies = {
    deploy = data.aws_iam_policy_document.deploy.json
  }
}

data "aws_iam_policy_document" "deploy" {
  statement {
    sid    = "S3Deploy"
    effect = "Allow"

    actions = [
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]

    resources = [
      "arn:aws:s3:::${var.s3_bucket_name}",
      "arn:aws:s3:::${var.s3_bucket_name}/*",
    ]
  }

  statement {
    sid    = "CloudFrontInvalidation"
    effect = "Allow"

    actions = [
      "cloudfront:CreateInvalidation",
    ]

    resources = [
      "arn:aws:cloudfront::${var.aws_account_id}:distribution/${var.cloudfront_distribution_id}",
    ]
  }
}

# -------------------------------------------------------------------
# GitHub Branch Protection
# -------------------------------------------------------------------

data "github_repository" "this" {
  full_name = var.github_repository
}

resource "github_branch_protection" "main" {
  repository_id = data.github_repository.this.node_id
  pattern       = "main"

  required_pull_request_reviews {
    required_approving_review_count = 1
    dismiss_stale_reviews           = true
  }

  required_status_checks {
    strict = true
    contexts = [
      "build",
    ]
  }

  enforce_admins = false
}

# -------------------------------------------------------------------
# GitHub Actions Environment Secrets and Variables
# -------------------------------------------------------------------

resource "github_actions_environment_secret" "aws_account_id" {
  repository      = split("/", var.github_repository)[1]
  environment     = var.environment
  secret_name     = "AWS_ACCOUNT_ID"
  plaintext_value = var.aws_account_id
}

resource "github_actions_environment_secret" "oidc_role_arn" {
  repository      = split("/", var.github_repository)[1]
  environment     = var.environment
  secret_name     = "OIDC_ROLE_ARN"
  plaintext_value = module.oidc_github.iam_role_arn
}

resource "github_actions_environment_variable" "s3_bucket_name" {
  repository    = split("/", var.github_repository)[1]
  environment   = var.environment
  variable_name = "S3_BUCKET_NAME"
  value         = var.s3_bucket_name
}

resource "github_actions_environment_variable" "cloudfront_dist_id" {
  repository    = split("/", var.github_repository)[1]
  environment   = var.environment
  variable_name = "CLOUDFRONT_DIST_ID"
  value         = var.cloudfront_distribution_id
}
