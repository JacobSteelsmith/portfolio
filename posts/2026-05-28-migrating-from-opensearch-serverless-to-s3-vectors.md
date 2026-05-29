---
title: "Migrating from OpenSearch Serverless to S3 Vectors for Bedrock Knowledge Bases"
date: 2026-05-28
---

OpenSearch Serverless was costing around $700/month just to run a vector search collection for my resume chatbot's knowledge base. For a personal project with a small dataset and infrequent queries, that's hard to justify. Today I migrated the entire vector storage layer to Amazon S3 Vectors, a new service that provides native vector storage and querying at a fraction of the cost.

## Why S3 Vectors

S3 Vectors launched as a purpose-built vector storage option within S3 itself. It supports up to 2 billion vectors per index with sub-second query latency. For my use case — a resume knowledge base with maybe a few hundred chunks — it's a perfect fit. The tradeoff is latency (sub-second vs millisecond) and advanced search capability, which is completely acceptable for a simple chatbot that's already waiting on an LLM to generate a response.

The cost difference is dramatic. OpenSearch Serverless has a minimum collection cost regardless of usage. S3 Vectors is pure pay-per-use with no minimum.

## Tradeoffs

S3 Vectors is not a search engine. Moving from OpenSearch Serverless means giving up capabilities that a dedicated search engine provides. Here's what you lose:

**No hybrid search blending.** S3 Vectors cannot natively execute or merge a BM25 keyword search with a vector similarity search. With OpenSearch Serverless, you can combine precise keyword terms with conceptual meaning in a single query — boosting results that match exact phrases while still surfacing semantically related content. With S3 Vectors, you get vector similarity in and ranked results out.

**No complex text analytics or aggregations.** You can't group, bucket, or aggregate search results. Complex filtering like geolocation radius queries or deeply nested boolean conditions aren't available natively. The filterable metadata you do get is limited to simple key-value matching.

**Higher latency, lower throughput.** S3 Vectors is optimized for durable, cost-effective storage — not for consumer-facing applications demanding massive queries per second and single-digit millisecond latency. You get sub-second response times, not the millisecond-level performance of an in-memory search engine.

**Result volume limits.** S3 Vectors returns a maximum of 100 nearest neighbors per query, which limits deeper re-ranking workflows or applications that need to scan large result sets.

**Filterable metadata budget.** As I'll cover below, S3 Vectors has a hard 2 KB limit on filterable metadata per vector. I had to mark both `AMAZON_BEDROCK_TEXT` and `AMAZON_BEDROCK_METADATA` as non-filterable to stay within that budget, which means I can't filter query results by document attributes at query time.

### Why these tradeoffs are fine for my use case

Every query to my resume chatbot is a natural language question like "what experience does Jacob have with Kubernetes?" and pure semantic search handles this well. I'm not relating documents by metadata like date or location, I'm not doing keyword or faceted searches, and I don't need to aggregate results. The knowledge base has a few hundred chunks total, well under the 100-result limit per query.

The latency tradeoff is irrelevant when the response is already gated by an LLM generating a multi-paragraph answer. And with a small, single-purpose knowledge base, there's no scenario where I'd want to filter searches to subsets of documents or run complex boolean queries.

If this were a multi-tenant application, a product catalog with faceted navigation, or a high-QPS consumer search experience, S3 Vectors would be the wrong choice. For a personal RAG chatbot with infrequent queries and a small corpus, it's the right tool at the right price.

Note: Using the AWS console, vectors can be exported to OpenSearch gaining back the advanced functionality and performance. 

## The Terraform Migration

The migration involved replacing several resources in my `chatbot.tf`:

**Removed:**
- `aws_opensearchserverless_collection` and its three security/access policies
- `opensearch_index` resource (and the entire `opensearch` provider)
- The `opensearch-project/opensearch` provider from `versions.tf`

**Added:**
- `aws_s3vectors_vector_bucket` — the container for vector indexes
- `aws_s3vectors_index` — configured with 1024 dimensions, float32, euclidean distance
- Updated `storage_configuration` on the knowledge base from `OPENSEARCH_SERVERLESS` to `S3_VECTORS`

The knowledge base IAM role also needed updated permissions — replacing `aoss:APIAccessAll` with scoped `s3vectors:*` actions.

## State Management Challenges

Removing the OpenSearch provider created an interesting chicken-and-egg problem. Terraform needed the provider configured to plan the destruction of the old resources, but I'd already removed it from the config. Rather than temporarily adding back a stub provider, I removed the AOSS resources from state with `terraform state rm` and cleaned them up manually via the AWS Console.

The knowledge base itself also needed manual deletion between attempts because Bedrock enforces unique names — if a previous apply partially succeeded, the next attempt would hit a 409 Conflict.

## The Filterable Metadata Limit

This was the most frustrating part of the migration. After everything was deployed and I triggered the first knowledge base sync, it failed with:

```
Invalid record for key '...': Filterable metadata must have at most 2048 bytes
```

S3 Vectors has a hard 2 KB limit on filterable metadata per vector. By default, all metadata stored alongside a vector is filterable. Bedrock stores the text chunk content and document metadata as vector metadata, which easily exceeds 2 KB for any meaningful chunk of text.

### Fix 1: Non-filterable metadata keys

S3 Vectors indexes support a `metadata_configuration` block where you can declare certain keys as non-filterable. These keys can store up to 40 KB total but can't be used in query filters. Bedrock stores data under two keys: `AMAZON_BEDROCK_TEXT` (the chunk text) and `AMAZON_BEDROCK_METADATA` (internal metadata like S3 URI, chunk byte offsets, and document attributes).

Both need to be non-filterable to stay within the 2 KB filterable limit:

```hcl
resource "aws_s3vectors_index" "kb" {
  index_name         = "bedrock-knowledge-base-default-index"
  vector_bucket_name = aws_s3vectors_vector_bucket.kb.vector_bucket_name

  data_type       = "float32"
  dimension       = 1024
  distance_metric = "euclidean"

  metadata_configuration {
    non_filterable_metadata_keys = ["AMAZON_BEDROCK_TEXT", "AMAZON_BEDROCK_METADATA"]
  }
}
```

This is immutable after creation, so getting it wrong means destroying and recreating the index (and re-ingesting everything). I went through three iterations before landing on this — first with just `AMAZON_BEDROCK_TEXT`, which fixed most files but left 4 still failing because Bedrock's internal metadata alone was exceeding the limit on larger documents.

The AWS blog post on this integration only mentions `AMAZON_BEDROCK_TEXT`, but in practice you need both. Also note these key names are different from the OpenSearch Serverless field names (`AMAZON_BEDROCK_TEXT_CHUNK` and `AMAZON_BEDROCK_METADATA`). Different services, different conventions.

### Fix 2: YAML frontmatter in source documents

After adding the non-filterable text key, most documents synced successfully. But 4 files still failed. These all had YAML frontmatter with custom metadata:

```yaml
---
source-type: project
category: real-time-infrastructure
title: LiveKit Online Interview Platform - EKS Kubernetes Deployment
---
```

Bedrock parses this frontmatter and stores it as filterable metadata on every chunk from that document. Combined with Bedrock's own internal metadata (S3 URI, chunk position), the total filterable metadata exceeded 2 KB.

Since I wasn't using metadata filtering in my queries anyway (just straight semantic search), the simplest fix was to strip the frontmatter entirely. The folder structure (`skills/`, `projects/`, `code-samples/`) already provides organizational context, and the document headings contain the same information that was in the `title` field.

## Lessons Learned

1. **S3 Vectors has a 2 KB filterable metadata limit** — plan for this when designing your index. Declare large fields as non-filterable at creation time.

2. **The non-filterable keys for Bedrock are `AMAZON_BEDROCK_TEXT` and `AMAZON_BEDROCK_METADATA`** — you need both. The blog post only mentions the first one, but the internal metadata alone can exceed 2 KB on larger documents.

3. **Metadata configuration is immutable** — you can't change non-filterable keys after index creation. Get it right the first time or plan to recreate.

4. **YAML frontmatter in source documents becomes filterable metadata** — if you're not using metadata filtering in your queries, skip the frontmatter. It just eats into your 2 KB budget.

5. **Terraform state management matters during provider migrations** — when removing a provider entirely, decide upfront whether to keep it temporarily for clean destroys or remove resources from state and clean up manually.

The end result: same RAG chatbot functionality, same query quality, and a monthly bill that's actually proportional to what I'm using.
