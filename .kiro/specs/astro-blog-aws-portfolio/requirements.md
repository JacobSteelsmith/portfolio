# Requirements Document

## Introduction

This document defines the requirements for a three-phase project to build and deploy a modern technical blog, AWS engineering portfolio, and AI-powered career assistant. Phase 1 focuses on rapidly converting 184 existing Markdown blog posts (2006–2012) into a live Astro-powered static site deployed via AWS Amplify. Phase 2 transforms the project into a portfolio-quality AWS engineering showcase with CloudFormation infrastructure, CI/CD pipelines, and operational polish. Phase 3 adds a RAG-based conversational agent powered by Amazon Bedrock that allows visitors to ask natural language questions about the site owner's career, skills, and projects. The target audience is hiring managers, recruiters, engineering leaders, and consulting clients evaluating cloud platform engineering and AI/ML expertise. Note: This site does NOT include a consulting or services page. No such page is planned or required at this time.

## Glossary

- **Astro_Builder**: The Astro static site generator responsible for reading Markdown content and producing static HTML/CSS/JS output
- **Content_Loader**: The subsystem that reads Markdown files from the posts directory and parses frontmatter metadata
- **Tag_System**: The subsystem responsible for managing, inferring, and rendering tag-based categorization of posts
- **RSS_Generator**: The subsystem that produces an RSS/Atom feed from published posts
- **Sitemap_Generator**: The subsystem that produces an XML sitemap of all public pages
- **SEO_Engine**: The subsystem responsible for generating meta tags, Open Graph data, and structured data for each page
- **Draft_Filter**: The subsystem that excludes posts marked as drafts from production builds
- **Pagination_Engine**: The subsystem that splits blog listing pages into paginated sets
- **Amplify_Deployment**: The AWS Amplify Hosting service configuration that builds and deploys the site from GitHub
- **CloudFormation_Stack**: The AWS CloudFormation infrastructure-as-code template defining S3, CloudFront, ACM, Route 53, and OAC resources
- **CI_CD_Pipeline**: The GitHub Actions workflow responsible for building, testing, and deploying the site
- **CloudFront_Distribution**: The AWS CloudFront CDN distribution serving the static site
- **S3_Bucket**: The AWS S3 bucket storing the built static site assets
- **OAC_Policy**: The Origin Access Control policy restricting S3 access to CloudFront only
- **OIDC_Auth**: The OpenID Connect authentication mechanism used by GitHub Actions to assume AWS IAM roles without long-lived credentials
- **Ingestion_Pipeline**: The data pipeline that processes content sources (blog posts, resume, skills, project descriptions) into vector embeddings and stores them in the Vector_Database
- **Vector_Database**: The vector store (Amazon OpenSearch Serverless or Amazon Knowledge Base) holding embedded content chunks for semantic retrieval
- **RAG_Agent**: The Retrieval-Augmented Generation chat agent powered by Amazon Bedrock that answers visitor questions about career, skills, and projects
- **Knowledge_Base**: The structured content source (Markdown/JSON files) containing detailed skills, experience, projects, and career information used as input to the Ingestion_Pipeline
- **Bedrock_Model**: The Amazon Bedrock foundation model used by the RAG_Agent to generate conversational responses grounded in retrieved context
- **Chat_Widget**: The frontend UI component embedded in the site that allows visitors to interact with the RAG_Agent

## Requirements

### Requirement 1: Content Ingestion from Existing Markdown Files

**User Story:** As a site owner, I want the blog to read my 184 existing Markdown files so that all historical content is preserved and published without manual migration.

#### Acceptance Criteria

1. WHEN the Astro_Builder runs a build, THE Content_Loader SHALL read all files with the `.md` extension from the configured posts directory
2. WHEN a Markdown file follows the naming convention `YYYY-MM-DD-slug-title.md`, THE Content_Loader SHALL extract the date from the first 10 characters and derive the slug from the remaining filename segment after the date prefix and hyphen separator, excluding the `.md` extension
3. WHEN a Markdown file contains frontmatter with `title` and `date` fields, THE Content_Loader SHALL use those values as the post title and publication date, taking precedence over filename-derived values
4. WHEN a Markdown file contains extended frontmatter fields (description, tags, draft, canonical URL, slug), THE Content_Loader SHALL use those values to override filename-derived defaults
5. IF a Markdown file contains frontmatter that fails YAML parsing or is missing the required `title` field, THEN THE Content_Loader SHALL log a warning identifying the filename and skip the file without failing the build
6. IF a Markdown file does not match the expected `YYYY-MM-DD-slug.md` naming pattern and does not contain a `date` field in frontmatter, THEN THE Content_Loader SHALL log a warning and skip the file without failing the build
7. WHEN the build completes, THE Content_Loader SHALL have processed all valid `.md` files in the posts directory and log the total count of successfully loaded posts and the count of skipped files

### Requirement 2: Frontmatter Schema and Defaults

**User Story:** As a site owner, I want a well-defined frontmatter schema with sensible defaults so that existing posts work without modification while new posts can use richer metadata.

#### Acceptance Criteria

1. THE Content_Loader SHALL support the following frontmatter fields: title (required, max 200 characters), date (required, format YYYY-MM-DD), description (optional, max 320 characters), tags (optional array, max 10 items), draft (optional boolean, default false), canonicalUrl (optional), slug (optional, lowercase alphanumeric and hyphens only)
2. WHEN a post lacks a `description` field, THE Content_Loader SHALL generate a description from the first 160 characters of the post body plain text (with markdown syntax stripped), truncated at the last word boundary
3. IF a post lacks a `description` field and the post body plain text is shorter than 160 characters, THEN THE Content_Loader SHALL use the entire post body plain text as the description
4. WHEN a post lacks a `slug` field, THE Content_Loader SHALL derive the slug from the filename by removing the leading `YYYY-MM-DD-` date prefix and the `.md` extension
5. WHEN a post lacks a `tags` field, THE Content_Loader SHALL assign an empty tags array
6. WHEN a post lacks a `draft` field, THE Content_Loader SHALL treat the post as published (draft = false)

### Requirement 3: Static Site Generation

**User Story:** As a site owner, I want the entire site generated as static HTML at build time so that no server-side runtime is required and pages load quickly.

#### Acceptance Criteria

1. THE Astro_Builder SHALL produce static HTML, CSS, and JavaScript files for all pages at build time, with output configured for fully static generation requiring no server-side runtime to serve
2. THE Astro_Builder SHALL generate one HTML page per published blog post, using the post slug as the URL path segment
3. THE Astro_Builder SHALL generate paginated blog index pages listing all published posts sorted in reverse chronological order
4. THE Astro_Builder SHALL generate one page per tag showing all posts with that tag
5. THE Astro_Builder SHALL generate the homepage, about page, resume page, contact page, and architecture page as static HTML
6. IF the build completes successfully, THEN THE Astro_Builder SHALL produce a self-contained output directory where all internal links resolve to files within that directory

### Requirement 4: Draft Post Filtering

**User Story:** As a site owner, I want draft posts hidden from production builds so that I can work on posts without publishing them prematurely.

#### Acceptance Criteria

1. WHEN the build environment is production, THE Draft_Filter SHALL exclude all posts where `draft` is true from the generated output, including individual post pages, blog listing pages, tag listing pages, and pagination counts
2. WHEN the build environment is development, THE Draft_Filter SHALL include draft posts in the generated output and render a visible "Draft" indicator on each draft post's page and listing entry to distinguish it from published posts
3. WHEN the build environment is production, THE Draft_Filter SHALL exclude draft posts from the RSS feed, sitemap, and tag post counts
4. IF a tag has zero published posts after draft exclusion in production, THEN THE Draft_Filter SHALL omit that tag from the tags index page and not generate a tag listing page for it

### Requirement 5: Homepage with Recent Posts and Professional Positioning

**User Story:** As a site owner, I want a homepage that features recent posts and communicates my professional positioning so that visitors immediately understand my expertise.

#### Acceptance Criteria

1. THE Astro_Builder SHALL render the homepage with a professional introduction section highlighting cloud platform engineering, AWS modernization, serverless/distributed systems, and technical leadership
2. THE Astro_Builder SHALL display the 5 most recent published posts on the homepage in reverse chronological order, showing each post's title, date, description, and tags
3. THE Astro_Builder SHALL include links to the About page, Resume page, and external profiles (LinkedIn, GitHub) from the homepage
4. WHEN one or more posts have the `featured` frontmatter field set to true, THE Astro_Builder SHALL render a featured posts section on the homepage displaying up to 5 editorially selected posts
5. IF no posts have the `featured` frontmatter field set to true, THEN THE Astro_Builder SHALL omit the featured posts section from the homepage
6. IF fewer than 5 published posts exist, THEN THE Astro_Builder SHALL display all available published posts in the recent posts section

### Requirement 6: Blog Listing with Pagination

**User Story:** As a visitor, I want to browse all blog posts across paginated listing pages so that I can discover content without loading hundreds of posts at once.

#### Acceptance Criteria

1. THE Pagination_Engine SHALL split the full list of published posts into pages of 10 posts each, where the last page may contain fewer than 10 posts
2. THE Pagination_Engine SHALL sort posts in reverse chronological order (newest first) using the post `date` field, with ties broken by filename in reverse alphabetical order
3. WHEN a listing page has a next or previous page, THE Pagination_Engine SHALL render navigation links to adjacent pages and display the current page number and total page count
4. THE Pagination_Engine SHALL display the post title, date, description (truncated to 160 characters maximum), and tags for each post on the listing page
5. THE Pagination_Engine SHALL generate the first listing page at the blog index path and subsequent pages at sequentially numbered subpaths (e.g., /blog/, /blog/2/, /blog/3/)

### Requirement 7: Tag System and Tag Pages

**User Story:** As a visitor, I want to browse posts by tag so that I can find content on specific topics.

#### Acceptance Criteria

1. WHEN a post has one or more tags defined in frontmatter, THE Tag_System SHALL associate the post with each tag using case-insensitive matching so that "JavaScript" and "javascript" resolve to the same tag
2. THE Tag_System SHALL generate one listing page per unique tag showing all posts with that tag sorted in reverse chronological order (newest first)
3. THE Tag_System SHALL generate a tags index page listing all tags alphabetically with their published post counts
4. THE Tag_System SHALL render tag links on individual post pages and listing pages, where each tag link navigates to that tag's listing page
5. IF a tag has zero published posts after draft filtering, THEN THE Tag_System SHALL exclude that tag from the tags index page and not generate a listing page for it

### Requirement 8: RSS Feed Generation

**User Story:** As a visitor, I want an RSS feed so that I can subscribe to new posts using a feed reader.

#### Acceptance Criteria

1. THE RSS_Generator SHALL produce a valid RSS 2.0 feed at the URL path /rss.xml
2. THE RSS_Generator SHALL include up to the 20 most recent published posts in the feed, sorted by publication date descending
3. THE RSS_Generator SHALL include the post title, publication date, description, and an absolute URL link to the full post for each feed entry
4. THE RSS_Generator SHALL exclude draft posts from the feed
5. THE RSS_Generator SHALL include channel-level metadata in the feed: site title, site description, and site URL
6. THE Astro_Builder SHALL include an RSS autodiscovery `<link>` tag (with type `application/rss+xml`) in the HTML `<head>` of all pages

### Requirement 9: Sitemap Generation

**User Story:** As a site owner, I want an automatically generated XML sitemap so that search engines can discover and index all pages.

#### Acceptance Criteria

1. THE Sitemap_Generator SHALL produce an XML sitemap at /sitemap.xml that conforms to the Sitemaps.org protocol 0.9 schema
2. THE Sitemap_Generator SHALL include all published post URLs, paginated blog listing pages, tag pages, and static pages (homepage, about, resume, contact, and architecture) in the sitemap
3. THE Sitemap_Generator SHALL exclude draft posts from the sitemap
4. THE Sitemap_Generator SHALL include a `<lastmod>` element for each URL entry, using the post publication date for blog posts and the most recent post date among associated posts for tag pages and paginated listing pages
5. WHEN a build completes, THE Sitemap_Generator SHALL produce the sitemap containing one `<url>` entry per included page with no duplicate URLs

### Requirement 10: SEO Metadata

**User Story:** As a site owner, I want proper SEO metadata on every page so that search engines and social media platforms display my content correctly.

#### Acceptance Criteria

1. THE SEO_Engine SHALL render a unique `<title>` tag and `<meta name="description">` tag for each page, where the title is derived from the page-specific title and the description is derived from the page-specific description or auto-generated summary
2. THE SEO_Engine SHALL render Open Graph meta tags (og:title, og:description, og:type, og:url, og:image) for each page, using og:type "article" for blog posts and "website" for all other pages
3. THE SEO_Engine SHALL render Twitter Card meta tags (twitter:card, twitter:title, twitter:description) for each page using the "summary" card type
4. THE SEO_Engine SHALL render a canonical URL `<link rel="canonical">` tag for each page, defaulting to the page's absolute URL on the configured site domain
5. WHEN a post specifies a `canonicalUrl` in frontmatter, THE SEO_Engine SHALL use that value as the canonical URL instead of the default absolute URL
6. THE SEO_Engine SHALL truncate the rendered `<meta name="description">` content to a maximum of 160 characters

### Requirement 11: Responsive Layout and Design

**User Story:** As a visitor, I want the site to be readable and visually polished on any device so that I have a good experience on mobile, tablet, and desktop.

#### Acceptance Criteria

1. THE Astro_Builder SHALL render all pages using a responsive layout that adapts to viewport widths from 320px to 2560px without horizontal scrollbar, without requiring horizontal scrolling, and without content overflowing the viewport
2. THE Astro_Builder SHALL use a consistent typographic scale with a minimum body font size of 16px and constrain content width to a maximum of 80 characters per line on viewports wider than 1200px
3. WHILE the viewport width is below 768px, THE Astro_Builder SHALL render navigation as a collapsible menu (hamburger menu or equivalent) that is operable via touch targets of at least 44x44px and accessible via keyboard
4. THE Astro_Builder SHALL apply syntax highlighting to all fenced code blocks in blog posts
5. THE Astro_Builder SHALL render all images and embedded media within blog posts at a maximum width of 100% of their containing element so that no media overflows the layout at any supported viewport width

### Requirement 12: Static Pages (About, Resume, Contact)

**User Story:** As a site owner, I want dedicated About, Resume, and Contact pages so that visitors can learn about my background and reach me.

#### Acceptance Criteria

1. THE Astro_Builder SHALL generate an About page containing the following sections: professional summary, expertise areas, and career narrative
2. THE Astro_Builder SHALL generate a Resume page presenting content organized into distinct sections for skills, work experience, and accomplishments
3. THE Astro_Builder SHALL generate a Contact page displaying at least an email address and links to LinkedIn and GitHub profiles
4. THE Astro_Builder SHALL include links to LinkedIn and GitHub profiles on the About and Contact pages
5. THE Astro_Builder SHALL source About, Resume, and Contact page content from Markdown files in the repository

### Requirement 13: AWS Amplify Deployment (Phase 1)

**User Story:** As a site owner, I want the site deployed via AWS Amplify connected to GitHub so that every push to the main branch triggers an automatic build and deployment.

#### Acceptance Criteria

1. WHEN a commit is pushed to the main branch on GitHub, THE Amplify_Deployment SHALL trigger an automatic build and deployment, and SHALL NOT trigger builds for pushes to other branches
2. THE Amplify_Deployment SHALL build the Astro site using the configured build command and output directory, completing the build within 30 minutes
3. THE Amplify_Deployment SHALL serve the built site over HTTPS with a valid SSL certificate
4. THE Amplify_Deployment SHALL support custom domain configuration with automatic SSL certificate provisioning
5. IF a build fails, THEN THE Amplify_Deployment SHALL retain the previous successful deployment and notify the site owner via the Amplify console build status and optionally via email notification
6. WHEN a build and deployment completes successfully, THE Amplify_Deployment SHALL make the updated site accessible at the configured domain within 5 minutes of build completion

### Requirement 14: CloudFormation Infrastructure (Phase 2)

**User Story:** As a site owner, I want reproducible AWS infrastructure defined in CloudFormation so that the deployment is documented, version-controlled, and portfolio-quality.

#### Acceptance Criteria

1. THE CloudFormation_Stack SHALL provision an S3_Bucket configured for static website hosting with all public access blocked via S3 Block Public Access settings
2. THE CloudFormation_Stack SHALL provision a CloudFront_Distribution with the S3_Bucket as origin using OAC_Policy, a default root object of `index.html`, and custom error responses that return `/index.html` with a 200 status for 403 and 404 origin errors
3. THE CloudFormation_Stack SHALL provision an ACM certificate for the custom domain with DNS validation via Route 53
4. THE CloudFormation_Stack SHALL provision Route 53 alias records (A and AAAA) pointing the custom domain to the CloudFront_Distribution
5. THE CloudFormation_Stack SHALL configure the OAC_Policy so that only the CloudFront_Distribution can read from the S3_Bucket
6. THE CloudFormation_Stack SHALL accept the custom domain name as a stack parameter and export the S3_Bucket name, CloudFront_Distribution ID, and CloudFront_Distribution domain name as stack outputs
7. THE CloudFormation_Stack SHALL be a valid CloudFormation template that passes `aws cloudformation validate-template` without errors

### Requirement 15: GitHub Actions CI/CD Pipeline (Phase 2)

**User Story:** As a site owner, I want a GitHub Actions pipeline with OIDC authentication so that deployments are automated and use short-lived credentials instead of stored secrets.

#### Acceptance Criteria

1. WHEN a commit is pushed to the main branch, THE CI_CD_Pipeline SHALL build the Astro site and deploy the output to the production S3_Bucket
2. THE CI_CD_Pipeline SHALL authenticate to AWS using OIDC_Auth to assume an IAM role without long-lived access keys
3. WHEN a deployment to S3 completes, THE CI_CD_Pipeline SHALL create a CloudFront invalidation for all paths to clear cached content
4. WHEN a pull request is opened or updated, THE CI_CD_Pipeline SHALL build the Astro site and deploy the output to a preview environment using a separate S3_Bucket and CloudFront_Distribution configuration
5. THE CI_CD_Pipeline SHALL maintain distinct configurations per environment (preview, staging, production) where each environment uses its own S3_Bucket, CloudFront_Distribution, and domain or URL path
6. IF the build or deployment fails, THEN THE CI_CD_Pipeline SHALL halt the pipeline and report the failure via the GitHub Actions workflow status on the associated commit or pull request

### Requirement 16: Architecture Showcase Page (Phase 2) — MANDATORY

**User Story:** As a site owner, I want a mandatory architecture page explaining how the site is built so that visitors can evaluate my AWS engineering skills. This page is required and must be present in the production site.

#### Acceptance Criteria

1. THE Astro_Builder SHALL generate an Architecture page that includes a dedicated section for each infrastructure component (S3, CloudFront, Route 53, ACM, OAC), where each section states the component's role in the system and the reason it was chosen
2. THE Astro_Builder SHALL include a visual diagram on the Architecture page that depicts all infrastructure components, the request flow from visitor to origin, and the relationships between components (CloudFront to S3 via OAC, Route 53 to CloudFront, ACM to CloudFront)
3. THE Astro_Builder SHALL document the CI/CD pipeline on the Architecture page, covering the build trigger, OIDC authentication step, S3 deployment step, and CloudFront cache invalidation step
4. THE Astro_Builder SHALL include at least 3 design decisions on the Architecture page, each stating the choice made, at least one alternative considered, and the rationale for the chosen approach
5. THE Astro_Builder SHALL include the Architecture page in the site's main navigation

### Requirement 17: Performance and Accessibility

**User Story:** As a site owner, I want the site to score well on performance and accessibility audits so that it demonstrates engineering quality and is usable by all visitors.

#### Acceptance Criteria

1. THE Astro_Builder SHALL produce pages that achieve a Lighthouse Performance score of 90 or above when tested in mobile mode on the homepage, a blog post page, and a tag listing page
2. THE Astro_Builder SHALL produce pages that achieve a Lighthouse Accessibility score of 90 or above when tested in mobile mode on the homepage, a blog post page, and a tag listing page
3. THE Astro_Builder SHALL produce valid semantic HTML with no skipped heading levels (e.g., no h1 followed directly by h3), alt text on all non-decorative images, and ARIA labels on all interactive elements that lack visible text labels (icons, hamburger menus, toggle buttons)
4. THE Astro_Builder SHALL produce pages with a total page weight under 500KB for blog post pages (excluding images within post content)
5. THE Astro_Builder SHALL produce pages with a total page weight under 300KB for the homepage and static pages (About, Resume, Contact) excluding images within content sections

### Requirement 18: Security Baseline

**User Story:** As a site owner, I want security best practices applied from the start so that the site and infrastructure are protected against common threats.

#### Acceptance Criteria

1. THE CloudFront_Distribution SHALL serve all content over HTTPS with HTTP-to-HTTPS redirect and enforce a minimum TLS version of TLS 1.2
2. THE S3_Bucket SHALL block all public access and allow reads only through the OAC_Policy
3. THE CI_CD_Pipeline SHALL use OIDC_Auth with an IAM role that permits only s3:PutObject, s3:DeleteObject, and s3:ListBucket on the specific S3_Bucket and cloudfront:CreateInvalidation on the specific CloudFront_Distribution
4. THE CloudFront_Distribution SHALL set the following security headers: Strict-Transport-Security with a max-age of at least 31536000 seconds, X-Content-Type-Options set to nosniff, X-Frame-Options set to DENY, and a Content-Security-Policy header restricting resource loading to same-origin by default
5. WHILE in Phase 1, THE Amplify_Deployment SHALL serve all content over HTTPS

### Requirement 19: Knowledge Base Content Authoring (Phase 3)

**User Story:** As a site owner, I want to maintain a structured knowledge base of my skills, experience, and projects so that the RAG agent has rich, accurate content to draw from when answering visitor questions.

#### Acceptance Criteria

1. THE Knowledge_Base SHALL consist of Markdown or JSON files stored in a dedicated directory within the repository, with each file containing a metadata header identifying its content category (skills, work experience, projects, certifications, or career narrative)
2. THE Knowledge_Base SHALL include at least one code sample file per claimed language or framework, with each code sample file annotated with metadata specifying the programming language and the associated project or skill area
3. THE Knowledge_Base SHALL be stored in the same GitHub repository as the blog content
4. THE Knowledge_Base SHALL include content from blog posts, the resume page, dedicated skills/project description files, and representative code samples, with each content source identifiable by a source-type metadata field
5. WHEN a commit modifying files in the Knowledge_Base directory is pushed to the repository, THE Ingestion_Pipeline SHALL be manually triggerable via a CI workflow dispatch or CLI command to re-process the changed content
6. THE Knowledge_Base SHALL organize files using a directory structure that separates content by category (skills, experience, projects, certifications, code-samples) so that the Ingestion_Pipeline can discover and classify content by path

### Requirement 20: Vector Embedding Ingestion Pipeline (Phase 3)

**User Story:** As a site owner, I want an automated pipeline that converts my knowledge base content into vector embeddings so that the RAG agent can perform semantic search over my career information.

#### Acceptance Criteria

1. THE Ingestion_Pipeline SHALL chunk Knowledge_Base content into segments of 500–1000 tokens per chunk with an overlap of 50–100 tokens between consecutive chunks
2. THE Ingestion_Pipeline SHALL support ingestion of Markdown text content (experience, skills, project descriptions) and code sample files
3. WHEN processing code samples, THE Ingestion_Pipeline SHALL preserve language metadata and associate the code with its parent project or skill context based on the Knowledge_Base directory structure or file-level metadata
4. THE Ingestion_Pipeline SHALL generate vector embeddings for each chunk using an Amazon Bedrock embedding model
5. THE Ingestion_Pipeline SHALL store the embeddings and associated metadata (source type, language, project, skill area) in the Vector_Database
6. WHEN the Ingestion_Pipeline processes updated content, THE Ingestion_Pipeline SHALL delete all embeddings previously generated from the affected source documents and store newly generated embeddings in their place
7. THE Ingestion_Pipeline SHALL be defined as infrastructure-as-code in the CloudFormation_Stack or as a reproducible script
8. IF the Amazon Bedrock embedding API call fails or a Knowledge_Base source file is empty or unparseable, THEN THE Ingestion_Pipeline SHALL log the error with the affected source file identifier, skip the failed item, and continue processing remaining content
9. WHEN the Ingestion_Pipeline completes a run, THE Ingestion_Pipeline SHALL produce a summary report indicating the number of source files processed, chunks generated, embeddings stored, and any files that were skipped due to errors
10. WHEN processing content, THE Ingestion_Pipeline SHALL filter out and exclude any content chunk that references "National Testing Network", "NTN", "Ergometrics", or any encryption keys, and SHALL NOT store embeddings for excluded chunks in the Vector_Database

### Requirement 21: RAG Chat Agent on Amazon Bedrock (Phase 3)

**User Story:** As a visitor, I want to ask natural language questions about the site owner's career, skills, and projects so that I can quickly find relevant information without reading every page.

#### Acceptance Criteria

1. WHEN a visitor submits a question through the Chat_Widget, THE RAG_Agent SHALL retrieve the top 5 most semantically similar chunks from the Vector_Database and discard any chunk with a similarity score below the configured relevance threshold
2. WHEN the RAG_Agent has retrieved relevant chunks for a visitor question, THE RAG_Agent SHALL pass the retrieved context and the visitor question to the Bedrock_Model and return a natural language response derived solely from the retrieved context
3. WHEN the RAG_Agent generates a response, THE RAG_Agent SHALL include at least one source attribution per response identifying the origin content by blog post title, project name, or skill area
4. IF all retrieved chunks from the Vector_Database fall below the configured relevance threshold for a query, THEN THE RAG_Agent SHALL respond with a message indicating it does not have information to answer that question
5. THE RAG_Agent SHALL restrict responses to information present in the Knowledge_Base and shall not include claims about skills, experience, or projects that are absent from the retrieved context
6. IF the Bedrock_Model is unavailable or returns an error, THEN THE RAG_Agent SHALL return an error message indicating the service is temporarily unavailable and preserve the visitor's original question in the Chat_Widget
7. WHEN the RAG_Agent receives a visitor question, THE RAG_Agent SHALL return a complete response within 10 seconds measured from question submission to response delivery
8. THE RAG_Agent SHALL never include references to "National Testing Network", "NTN", "Ergometrics", or encryption keys in any response, even if such content exists in the Vector_Database, and SHALL treat any retrieved chunk containing these terms as irrelevant context to be discarded before response generation

### Requirement 22: Chat Widget Frontend (Phase 3)

**User Story:** As a visitor, I want a chat interface on the site so that I can interact with the RAG agent without leaving the page.

#### Acceptance Criteria

1. THE Chat_Widget SHALL render as a collapsible panel or overlay with a persistent trigger button visible on every page of the site
2. THE Chat_Widget SHALL allow visitors to type free-text questions up to 500 characters and display the RAG_Agent responses in a chronologically ordered message list that visually distinguishes visitor messages from agent responses
3. WHILE the Chat_Widget is awaiting a RAG_Agent response, THE Chat_Widget SHALL display a loading indicator and disable the send button
4. IF the RAG_Agent does not respond within 30 seconds or returns an error, THEN THE Chat_Widget SHALL display an error message indicating the request failed and allow the visitor to retry the question
5. THE Chat_Widget SHALL ensure all interactive elements (input field, send button, trigger button, close button) are operable via touch and keyboard at viewport widths from 320px to 2560px
6. WHILE the Chat_Widget is collapsed, THE Chat_Widget SHALL not obscure page content or navigation elements beyond the area occupied by its trigger button
7. THE Chat_Widget SHALL retain the conversation message history for the duration of the visitor's browser session, including across page navigations within the site

### Requirement 23: RAG Agent API and Security (Phase 3)

**User Story:** As a site owner, I want the RAG agent API to be secure and cost-controlled so that it cannot be abused or generate unexpected AWS charges.

#### Acceptance Criteria

1. THE RAG_Agent SHALL be exposed through an API Gateway endpoint with rate limiting configured to allow no more than 100 requests per minute across all clients
2. THE RAG_Agent SHALL enforce a maximum request rate of 10 requests per IP address per minute
3. THE RAG_Agent SHALL limit response token length to a maximum of 1024 tokens per response to control Bedrock_Model invocation costs
4. THE CloudFormation_Stack SHALL define all RAG infrastructure (API Gateway, Lambda, Bedrock permissions, Vector_Database) as infrastructure-as-code
5. IF the rate limit is exceeded, THEN THE RAG_Agent SHALL return an HTTP 429 status response to the Chat_Widget with a message indicating the request was throttled and the visitor should wait before trying again
6. THE RAG_Agent SHALL reject any input question exceeding 500 characters and return an error response indicating the question is too long
