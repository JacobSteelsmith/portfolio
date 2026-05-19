# Implementation Plan: Astro Blog AWS Portfolio

## Overview

This plan implements a three-phase professional portfolio site: Phase 1 gets the Astro blog live on AWS Amplify, Phase 2 replaces Amplify with production-grade CloudFormation infrastructure and CI/CD, and Phase 3 adds a RAG chat agent powered by Amazon Bedrock. Tasks are ordered to deliver value incrementally — the site goes live in Phase 1, gains infrastructure polish in Phase 2, and adds AI capabilities in Phase 3.

## Tasks

- [x] 1. Initialize Astro project and content system
  - [x] 1.1 Scaffold Astro project with TypeScript and configure content collections
    - Initialize Astro project in the repository root with TypeScript strict mode
    - Install dependencies: `astro`, `@astrojs/rss`, `@astrojs/sitemap`
    - Configure `astro.config.mjs` with `output: 'static'`, site URL `https://jacob.steelsmith.org`, and sitemap integration
    - Create `src/content/config.ts` defining the posts collection schema (title, date, description, tags, draft, canonicalUrl, slug, featured)
    - _Requirements: 1.1, 2.1, 3.1_

  - [x] 1.2 Implement content loader with filename parsing and frontmatter defaults
    - Create `src/utils/content-loader.ts` with filename parsing regex `/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/`
    - Implement slug derivation from filename when frontmatter `slug` is absent
    - Implement auto-description generation: strip markdown, truncate to 160 chars at word boundary
    - Implement defaults: empty tags array, draft=false, featured=false
    - Ensure frontmatter values take precedence over filename-derived values
    - Log warnings and skip files with invalid frontmatter or missing required fields without failing the build
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 1.3 Write property tests for filename parsing (Property 1)
    - **Property 1: Filename parsing extracts date and slug correctly**
    - **Validates: Requirements 1.2, 2.4**

  - [ ]* 1.4 Write property tests for frontmatter precedence (Property 2)
    - **Property 2: Frontmatter values take precedence over filename-derived values**
    - **Validates: Requirements 1.3, 1.4**

  - [ ]* 1.5 Write property tests for invalid frontmatter handling (Property 3)
    - **Property 3: Invalid frontmatter causes skip without build failure**
    - **Validates: Requirements 1.5, 1.6**

  - [ ]* 1.6 Write property tests for schema validation (Property 4)
    - **Property 4: Frontmatter schema validation**
    - **Validates: Requirements 2.1**

  - [ ]* 1.7 Write property tests for auto-generated description (Property 5)
    - **Property 5: Auto-generated description from post body**
    - **Validates: Requirements 2.2, 2.3**

- [x] 2. Implement core site pages and utilities
  - [x] 2.1 Implement tag system and pagination utilities
    - Create `src/utils/tags.ts` with `normalizeTag`, `getAllTags`, `getPostsByTag` functions
    - Create `src/utils/pagination.ts` with `paginate` function (pageSize=10, basePath='/blog')
    - Implement case-insensitive tag normalization
    - Implement reverse chronological sort with filename tiebreaker
    - _Requirements: 6.1, 6.2, 7.1_

  - [ ]* 2.2 Write property tests for tag normalization (Property 9)
    - **Property 9: Tag normalization and indexing**
    - **Validates: Requirements 7.1, 7.2, 7.3**

  - [ ]* 2.3 Write property tests for pagination correctness (Property 8)
    - **Property 8: Pagination correctness**
    - **Validates: Requirements 6.1, 6.3, 6.5**

  - [ ]* 2.4 Write property tests for sort order (Property 7)
    - **Property 7: Blog listing sort order**
    - **Validates: Requirements 3.3, 6.2**

  - [x] 2.5 Implement draft filtering logic
    - Create `src/utils/drafts.ts` with environment-aware draft filtering
    - Exclude drafts from production: post pages, listings, tags, pagination counts, RSS, sitemap
    - Include drafts in development with visible "Draft" indicator
    - Omit tags with zero published posts after draft exclusion
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 2.6 Write property tests for draft filtering (Property 6)
    - **Property 6: Draft posts excluded from all production outputs**
    - **Validates: Requirements 4.1, 4.3, 4.4, 7.5, 8.4, 9.3**

- [x] 3. Implement page templates and layouts
  - [x] 3.1 Create base layout and SEO component
    - Create `src/layouts/BaseLayout.astro` with responsive HTML structure, meta viewport, and font loading
    - Create `src/components/SEO.astro` implementing all SEO metadata: title, description (≤160 chars), Open Graph (og:title, og:description, og:type, og:url), Twitter Card, canonical URL
    - Use og:type "article" for posts, "website" for other pages
    - Respect `canonicalUrl` frontmatter field when present
    - Include RSS autodiscovery `<link>` tag in head
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 8.6_

  - [ ]* 3.2 Write property tests for SEO metadata completeness (Property 13)
    - **Property 13: SEO metadata completeness**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6**

  - [x] 3.3 Create navigation component with responsive hamburger menu
    - Create `src/components/Navigation.astro` with links to Home, Blog, About, Resume, Contact, Architecture
    - Implement collapsible hamburger menu below 768px viewport
    - Ensure touch targets ≥ 44x44px, keyboard operable, ARIA labels on interactive elements
    - _Requirements: 11.3, 16.5, 17.3_

  - [x] 3.4 Create blog post template with syntax highlighting
    - Create `src/layouts/PostLayout.astro` for individual blog posts
    - Include post title, date, tags (linked to tag pages), and rendered markdown content
    - Apply syntax highlighting to fenced code blocks
    - Ensure heading hierarchy is valid (no skipped levels)
    - Constrain content width to max 80 characters per line on wide viewports
    - _Requirements: 3.2, 7.4, 11.2, 11.4, 11.5, 17.3_

  - [ ]* 3.5 Write property tests for heading hierarchy (Property 14)
    - **Property 14: Heading level hierarchy**
    - **Validates: Requirements 17.3**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement blog listing, tag, and homepage routes
  - [x] 5.1 Implement paginated blog listing pages
    - Create `src/pages/blog/[...page].astro` with dynamic pagination
    - Display post title, date, description (≤160 chars), and tags per entry
    - Render next/previous navigation links with page count
    - First page at `/blog/`, subsequent at `/blog/2/`, `/blog/3/`, etc.
    - _Requirements: 3.3, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 5.2 Implement tag listing pages and tags index
    - Create `src/pages/tags/[tag].astro` for per-tag post listings (reverse chronological)
    - Create `src/pages/tags/index.astro` listing all tags alphabetically with post counts
    - Exclude tags with zero published posts
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 5.3 Implement homepage with recent posts and featured section
    - Create `src/pages/index.astro` with professional introduction section
    - Display 5 most recent published posts (or all if fewer than 5)
    - Conditionally render featured posts section (up to 5 featured posts)
    - Include links to About, Resume, LinkedIn, GitHub
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 5.4 Write property tests for homepage post selection (Property 10)
    - **Property 10: Homepage post selection**
    - **Validates: Requirements 5.2, 5.4, 5.5, 5.6**

- [x] 6. Implement RSS, sitemap, and static pages
  - [x] 6.1 Implement RSS feed generation
    - Create `src/pages/rss.xml.ts` using `@astrojs/rss`
    - Include up to 20 most recent published posts sorted by date descending
    - Include title, publication date, description, and absolute URL per entry
    - Include channel metadata: site title, description, URL
    - Exclude draft posts
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 6.2 Write property tests for RSS feed (Property 11)
    - **Property 11: RSS feed completeness and ordering**
    - **Validates: Requirements 8.2, 8.3**

  - [x] 6.3 Configure sitemap generation
    - Configure `@astrojs/sitemap` integration in `astro.config.mjs`
    - Verify sitemap includes all published pages with `<lastmod>` dates
    - Verify no duplicate URLs and no draft posts
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 6.4 Write property tests for sitemap integrity (Property 12)
    - **Property 12: Sitemap integrity**
    - **Validates: Requirements 9.2, 9.4, 9.5**

  - [x] 6.5 Create static pages (About, Resume, Contact)
    - Create `src/content/pages/about.md` with professional summary, expertise areas, career narrative
    - Create `src/content/pages/resume.md` with skills, work experience, accomplishments sections
    - Create `src/content/pages/contact.md` with email, LinkedIn, GitHub links
    - Create corresponding Astro page routes sourcing from these Markdown files
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 7. Checkpoint - Phase 1 site build verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify `npm run build` completes successfully with all 184 posts processed
  - Verify responsive layout at 320px, 768px, 1200px, 2560px viewports

- [-] 8. Deploy Phase 1 via AWS Amplify
  - [ ] 8.1 Configure AWS Amplify hosting
    - Create `amplify.yml` build spec with Node.js setup, `npm ci`, `npm run build`, output directory `dist/`
    - Connect GitHub repository main branch to Amplify
    - Configure custom domain `jacob.steelsmith.org` using existing Route 53 hosted zone
    - Verify HTTPS with valid SSL certificate
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 18.5_

- [ ] 9. Implement CloudFormation infrastructure (Phase 2)
  - [ ] 9.1 Create CloudFormation template for S3, CloudFront, ACM, Route 53, OAC
    - Create `infrastructure/template.yaml` with parameters: DomainName, HostedZoneId, Environment
    - Define S3 bucket with BlockPublicAccess enabled
    - Define CloudFront OAC and bucket policy (CloudFront-only read access)
    - Define ACM certificate with DNS validation for `jacob.steelsmith.org`
    - Define CloudFront distribution with OAC, default root object `index.html`, custom error responses (403/404 → /index.html with 200)
    - Configure TLS 1.2+ minimum, HTTP-to-HTTPS redirect
    - Add security headers: HSTS (max-age ≥ 31536000), X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Content-Security-Policy
    - Define Route 53 A and AAAA alias records pointing `jacob.steelsmith.org` to CloudFront
    - Export outputs: BucketName, DistributionId, DistributionDomainName
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 18.1, 18.2, 18.4_

  - [ ] 9.2 Create Terraform configuration for OIDC and GitHub resources
    - Create `infrastructure/terraform/main.tf` with AWS and GitHub providers
    - Create `infrastructure/terraform/variables.tf` with github_repository, s3_bucket_name, cloudfront_distribution_id, aws_account_id
    - Implement IAM OIDC provider using `terraform-aws-oidc-github` module
    - Define IAM role with least-privilege policy (s3:PutObject, s3:DeleteObject, s3:ListBucket, cloudfront:CreateInvalidation)
    - Configure GitHub branch protection (require PR review + passing CI)
    - Manage GitHub Actions environment secrets (AWS_ACCOUNT_ID, OIDC_ROLE_ARN) and variables (S3_BUCKET_NAME, CLOUDFRONT_DIST_ID)
    - Create `infrastructure/terraform/outputs.tf` exporting `oidc_role_arn`
    - Configure S3 + DynamoDB remote state backend
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7, 18.3_

- [ ] 10. Implement GitHub Actions CI/CD pipeline (Phase 2)
  - [ ] 10.1 Create GitHub Actions deploy workflow
    - Create `.github/workflows/deploy.yml` triggered on push to main and pull requests
    - Implement steps: checkout, setup Node.js, install deps, build Astro site
    - Configure AWS credentials via OIDC (assume IAM role)
    - Deploy to S3 via `aws s3 sync dist/`
    - Create CloudFront invalidation for `/*`
    - Implement preview environment deployment for pull requests (separate bucket/distribution)
    - Report failure via GitHub Actions status on commit/PR
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [ ] 11. Create Architecture page (Phase 2 — MANDATORY)
  - [ ] 11.1 Create Architecture page content and route
    - Create `src/content/pages/architecture.md` with sections for each infrastructure component (S3, CloudFront, Route 53, ACM, OAC) explaining role and rationale
    - Include visual Mermaid diagram showing request flow and component relationships
    - Document CI/CD pipeline: build trigger, OIDC auth, S3 deploy, CloudFront invalidation
    - Include at least 3 design decisions with alternatives considered and rationale
    - Create `src/pages/architecture.astro` route sourcing from the Markdown file
    - Ensure Architecture page appears in main navigation
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 12. Checkpoint - Phase 2 infrastructure verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify CloudFormation template passes `aws cloudformation validate-template`
  - Verify Terraform plan runs without errors
  - Verify GitHub Actions workflow syntax is valid

- [ ] 13. Implement Knowledge Base and ingestion pipeline (Phase 3)
  - [ ] 13.1 Create Knowledge Base directory structure and content files
    - Create `knowledge-base/` directory with subdirectories: skills/, experience/, projects/, certifications/, code-samples/
    - Create initial content files with YAML metadata headers (source_type, category, language, project)
    - Include at least one code sample per claimed language/framework
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.6_

  - [ ] 13.2 Implement ingestion pipeline with content filtering
    - Create `infrastructure/ingestion/` directory with pipeline scripts
    - Implement chunking logic: 500–1000 tokens per chunk, 50–100 token overlap
    - Implement pre-ingestion content filter excluding chunks containing "National Testing Network", "NTN", "Ergometrics", or encryption key patterns
    - Implement embedding generation using Amazon Bedrock embedding model
    - Store embeddings with metadata (sourceFile, sourceType, category, language, project, chunkIndex) in Bedrock Knowledge Base
    - Implement upsert logic: delete old embeddings for updated source files before storing new ones
    - Generate summary report: files processed, chunks generated, embeddings stored, files skipped
    - Handle errors gracefully: log and skip failed items, continue processing
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8, 20.9, 20.10_

  - [ ]* 13.3 Write property tests for content chunking (Property 15)
    - **Property 15: Content chunking within bounds**
    - **Validates: Requirements 20.1**

  - [ ]* 13.4 Write property tests for sensitive content filtering (Property 16)
    - **Property 16: Sensitive content filtering (defense-in-depth)**
    - **Validates: Requirements 20.10, 21.8**

- [ ] 14. Implement RAG Agent Lambda and API (Phase 3)
  - [ ] 14.1 Implement RAG Agent Lambda function
    - Create `infrastructure/lambda/rag-agent/index.ts` with handler
    - Implement semantic search: retrieve top 5 chunks from Vector Database
    - Implement relevance threshold filtering (discard below-threshold chunks)
    - Implement post-retrieval sensitive term filtering (discard chunks with filtered terms)
    - Pass context + question to Bedrock model with max 1024 response tokens
    - Implement post-generation response filter: replace filtered terms or return fallback
    - Return structured ChatResponse with answer and source attributions
    - Handle "no relevant context" case with fallback message
    - Handle Bedrock unavailability with service error message
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8_

  - [ ]* 14.2 Write property tests for retrieval threshold enforcement (Property 17)
    - **Property 17: Retrieval threshold enforcement**
    - **Validates: Requirements 21.1, 21.4**

  - [ ]* 14.3 Write property tests for source attribution (Property 18)
    - **Property 18: Source attribution in responses**
    - **Validates: Requirements 21.3**

  - [ ]* 14.4 Write property tests for input length validation (Property 19)
    - **Property 19: Chat input length validation**
    - **Validates: Requirements 22.2, 23.6**

  - [ ] 14.5 Define RAG infrastructure in CloudFormation
    - Add API Gateway endpoint (`POST /chat`) with rate limiting (100 req/min global, 10 req/min per IP)
    - Add Lambda function resource with Bedrock permissions
    - Add request validation (question ≤ 500 characters)
    - Configure error responses: 429 (rate limited), 400 (input too long), 503 (service unavailable)
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6_

- [ ] 15. Implement Chat Widget frontend (Phase 3)
  - [ ] 15.1 Create Chat Widget component
    - Create `src/components/ChatWidget.astro` with collapsible overlay and persistent trigger button
    - Implement client-side JavaScript for state management (open/closed, messages, loading, error)
    - Implement message input with 500-character limit and validation
    - Display chronological message list distinguishing user/assistant messages
    - Show loading indicator while awaiting response, disable send button
    - Implement 30-second timeout with error message and retry capability
    - Display source attributions in assistant responses
    - Store conversation in `sessionStorage` for cross-page persistence
    - Ensure keyboard operability, touch targets ≥ 44x44px, responsive from 320px to 2560px
    - Ensure collapsed widget doesn't obscure page content beyond trigger button
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7_

  - [ ]* 15.2 Write property tests for chat session persistence (Property 20)
    - **Property 20: Chat session persistence**
    - **Validates: Requirements 22.7**

- [ ] 16. Final checkpoint - Full integration verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify full site build with all 184 posts succeeds
  - Verify all internal links resolve within build output
  - Verify CloudFormation template validates
  - Verify Terraform configuration is syntactically valid

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation between phases
- Property tests validate universal correctness properties from the design document using fast-check
- Unit tests validate specific examples and edge cases
- Phase 1 (tasks 1–8) delivers a live site quickly via Amplify
- Phase 2 (tasks 9–12) adds production infrastructure and CI/CD
- Phase 3 (tasks 13–16) adds the RAG chat agent
- The Architecture page (task 11) is MANDATORY and must be present in production
- Infrastructure code uses CloudFormation for AWS resources and Terraform for GitHub/OIDC resources

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "3.1"] },
    { "id": 2, "tasks": ["1.3", "1.4", "1.5", "1.6", "1.7", "2.1", "2.5", "3.3"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "2.6", "3.4"] },
    { "id": 4, "tasks": ["3.2", "3.5", "5.1", "5.2", "5.3"] },
    { "id": 5, "tasks": ["5.4", "6.1", "6.3", "6.5"] },
    { "id": 6, "tasks": ["6.2", "6.4", "8.1"] },
    { "id": 7, "tasks": ["9.1", "9.2"] },
    { "id": 8, "tasks": ["10.1", "11.1"] },
    { "id": 9, "tasks": ["13.1"] },
    { "id": 10, "tasks": ["13.2"] },
    { "id": 11, "tasks": ["13.3", "13.4", "14.1"] },
    { "id": 12, "tasks": ["14.2", "14.3", "14.4", "14.5"] },
    { "id": 13, "tasks": ["15.1"] },
    { "id": 14, "tasks": ["15.2"] }
  ]
}
```
