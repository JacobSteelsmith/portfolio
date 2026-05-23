# jacob.steelsmith.org

Personal portfolio site and technical blog built with Astro, deployed on AWS Amplify. Features 175+ blog posts spanning 2006–2012, an architecture overview, and links to the companion [resume site](https://resume.jacob.steelsmith.org) which demonstrates full Terraform IaC with a RAG chatbot.

## Architecture

This site uses AWS Amplify for managed hosting — a deliberate contrast to the [resume site](https://github.com/JacobSteelsmith/resume) which uses full Terraform IaC. Together they showcase two valid AWS deployment strategies: simplicity vs control.

### Stack

- **Framework**: Astro (static site generation, zero client-side JS)
- **Hosting**: AWS Amplify (managed CDN, auto-builds, SSL)
- **CI/CD**: Amplify auto-builds on push to main
- **Domain**: Route 53 + Amplify-managed SSL
- **Content**: 175+ Markdown blog posts with frontmatter schema

### How It Works

1. Content is authored as Markdown files in `posts/`
2. Astro builds static HTML at build time
3. Amplify detects pushes to the repository and triggers a build
4. Built assets are deployed to Amplify's global CDN

## Companion Project

The **resume site** ([resume.jacob.steelsmith.org](https://resume.jacob.steelsmith.org)) uses the same Astro framework but with a completely different infrastructure approach:

- All infrastructure managed by Terraform (S3, CloudFront, API Gateway, Lambda, WAF, Bedrock, OpenSearch Serverless)
- GitHub Actions CI/CD with OIDC authentication
- RAG-powered AI chatbot using Amazon Bedrock Knowledge Bases
- OpenSearch Serverless vector store for semantic search

See the [Architecture page](https://jacob.steelsmith.org/architecture) for a detailed comparison.

## Local Development

```bash
npm install
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Project Structure

```
├── posts/                  # 175+ Markdown blog posts (YYYY-MM-DD-slug.md)
├── src/
│   ├── components/         # Astro components (Navigation, SEO)
│   ├── content/
│   │   └── pages/          # Static page content (about, architecture, contact)
│   ├── layouts/            # Page layouts (BaseLayout, PostLayout)
│   ├── pages/              # Route pages
│   │   ├── blog/           # Paginated blog listing
│   │   ├── posts/          # Individual post pages
│   │   └── tags/           # Tag listing pages
│   └── utils/              # Content loader, tags, pagination, drafts
├── public/                 # Static assets
├── docs/                   # Deployment documentation
├── astro.config.mjs        # Astro configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## Features

- **Blog** — 175+ posts with tag system, pagination, RSS feed, sitemap
- **Architecture** — Detailed comparison of both sites' infrastructure approaches
- **SEO** — Open Graph, Twitter Cards, canonical URLs, meta descriptions
- **Responsive** — Mobile-first layout, hamburger nav
- **Draft System** — Environment-aware draft filtering (visible in dev, hidden in prod)
- **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation
- **Performance** — Static generation, no client JS by default, syntax highlighting

## Deployment

The site is deployed at [jacob.steelsmith.org](https://jacob.steelsmith.org) via AWS Amplify. Push to `main` triggers an automatic build and deploy.

## License

All blog content is © Jacob Steelsmith. Code in this repository is available for reference.
