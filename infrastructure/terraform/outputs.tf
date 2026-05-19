output "oidc_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC authentication"
  value       = module.oidc_github.iam_role_arn
}
