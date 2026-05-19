variable "github_repository" {
  description = "GitHub repository in format owner/repo"
  type        = string
  default     = "JacobSteelsmith/portfolio"
}

variable "s3_bucket_name" {
  description = "S3 bucket name from CloudFormation stack output"
  type        = string
}

variable "cloudfront_distribution_id" {
  description = "CloudFront distribution ID from CloudFormation stack output"
  type        = string
}

variable "aws_account_id" {
  description = "AWS account ID for OIDC trust policy"
  type        = string
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "production"
}
