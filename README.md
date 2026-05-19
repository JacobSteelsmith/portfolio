# jacob.steelsmith.org

Personal portfolio site and technical blog built with Astro, deployed on AWS. Features 184 blog posts (2006–2012), a professional resume, and (coming soon) a RAG-powered chat agent for career Q&A.

## Architecture

This project is built in three phases:

**Phase 1 — Astro Blog on AWS Amplify**
Static site generated from Markdown posts, deployed via AWS Amplify with automatic builds on push to main.

**Phase 2 — CloudFormation Infrastructure & CI/CD**
Production-grade hosting with S3 + CloudFront + Route 53 + ACM + OAC, defined in CloudFormation. GitHub Actions CI/CD pipeline using OIDC for keyless deployments. Terraform manages cross-platform resources (GitHub config, OIDC provider).

**Phase 3 — RAG Chat Agent**
Conversational AI powered by Amazon Bedrock that answers visitor questions about skills, experience, and projects using Retrieval-Augmented Generation over a curated knowledge base.

## Tech Stack

- **Static Site Generator** — [Astro](https://astro.build) (TypeScript, zero JS by default)
- **Content** — 184 Markdown blog posts with frontmatter schema
- **Hosting** — AWS Amplify (Phase 1) → S3 + CloudFront (Phase 2)
- **Infrastructure** — CloudFormation (AWS resources), Terraform (GitHub + OIDC)
- **CI/CD** — GitHub Actions with OIDC authentication
- **AI/ML** — Amazon Bedrock, Knowledge Bases, RAG architecture
- **Testing** — Vitest, fast-check (property-based testing)

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## Project Structure

```
├── posts/                  # 184 Markdown blog posts (YYYY-MM-DD-slug.md)
├── src/
│   ├── components/         # Astro components (Navigation, SEO, ChatWidget)
│   ├── content/
│   │   └── pages/          # Static page content (about, resume, contact)
│   ├── layouts/            # Page layouts (BaseLayout, PostLayout)
│   ├── pages/              # Route pages
│   │   ├── blog/           # Paginated blog listing
│   │   ├── posts/          # Individual post pages
│   │   └── tags/           # Tag listing pages
│   └── utils/              # Content loader, tags, pagination, drafts
├── infrastructure/         # IaC (Phase 2+)
│   ├── template.yaml       # CloudFormation stack
│   ├── terraform/          # Terraform config (OIDC, GitHub)
│   ├── ingestion/          # RAG ingestion pipeline (Phase 3)
│   └── lambda/             # RAG agent Lambda (Phase 3)
├── knowledge-base/         # RAG content sources (Phase 3)
├── astro.config.mjs        # Astro configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## Features

- **Blog** — 184 posts with tag system, pagination (10/page), RSS feed, sitemap
- **SEO** — Open Graph, Twitter Cards, canonical URLs, meta descriptions
- **Responsive** — Mobile-first layout, hamburger nav, 320px–2560px support
- **Draft System** — Environment-aware draft filtering (visible in dev, hidden in prod)
- **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation, valid heading hierarchy
- **Performance** — Static generation, no client JS by default, syntax highlighting

## Deployment

The site is deployed at [jacob.steelsmith.org](https://jacob.steelsmith.org).

- **Phase 1**: Push to `main` triggers AWS Amplify build and deploy
- **Phase 2**: GitHub Actions deploys to S3, invalidates CloudFront cache via OIDC

## License

All blog content is © Jacob Steelsmith. Infrastructure and application code in this repository is available for reference.
