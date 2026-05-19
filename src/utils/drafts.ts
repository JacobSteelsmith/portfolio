/**
 * Draft Filtering Utilities
 *
 * Provides environment-aware draft filtering for blog posts.
 * - In production: drafts are excluded from all outputs (pages, listings, tags, RSS, sitemap)
 * - In development: drafts are included but marked with a visible "Draft" indicator
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

/**
 * A post-like object with at minimum a `data.draft` field.
 * Compatible with Astro's CollectionEntry<'posts'> shape.
 */
export interface DraftFilterable {
  data: {
    draft?: boolean;
    tags?: string[];
  };
}

/**
 * Check if the current build environment is production.
 * Uses Astro's `import.meta.env.PROD` which is true during `astro build`
 * and false during `astro dev`.
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * Check if a post is a draft.
 *
 * @param post - A post object with a `data.draft` field
 * @returns true if the post is marked as a draft
 */
export function isDraft<T extends DraftFilterable>(post: T): boolean {
  return post.data.draft === true;
}

/**
 * Filter posts based on draft status and current environment.
 *
 * - In production: excludes all posts where `data.draft` is true
 * - In development: includes all posts (drafts remain for preview with "Draft" indicator)
 *
 * @param posts - Array of posts to filter
 * @returns Filtered array of posts appropriate for the current environment
 */
export function filterDrafts<T extends DraftFilterable>(posts: T[]): T[] {
  if (isProduction()) {
    return posts.filter((post) => !isDraft(post));
  }
  // In development, include all posts (drafts will be visually marked by templates)
  return posts;
}

/**
 * Get all unique tags that have at least one published (non-draft) post.
 * In production, tags associated only with draft posts are omitted.
 * In development, all tags are included.
 *
 * @param posts - Array of posts (already filtered or unfiltered)
 * @returns Set of tag strings that have published posts
 */
export function getPublishedTags<T extends DraftFilterable>(posts: T[]): Set<string> {
  const publishedPosts = filterDrafts(posts);
  const tags = new Set<string>();

  for (const post of publishedPosts) {
    if (post.data.tags) {
      for (const tag of post.data.tags) {
        tags.add(tag);
      }
    }
  }

  return tags;
}

/**
 * Filter a map of tags to only include those with at least one published post.
 * Useful for filtering tag counts after draft exclusion.
 *
 * @param tagCounts - Map of tag names to post counts (from all posts)
 * @param posts - Array of all posts (unfiltered)
 * @returns New map with only tags that have published posts
 */
export function filterTagsWithPublishedPosts<T extends DraftFilterable>(
  tagCounts: Map<string, number>,
  posts: T[],
): Map<string, number> {
  const publishedPosts = filterDrafts(posts);
  const filteredCounts = new Map<string, number>();

  for (const [tag] of tagCounts) {
    const count = publishedPosts.filter(
      (post) => post.data.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()),
    ).length;

    if (count > 0) {
      filteredCounts.set(tag, count);
    }
  }

  return filteredCounts;
}
