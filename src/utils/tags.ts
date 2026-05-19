/**
 * Tag System Utilities
 *
 * Provides functions for managing blog post tags:
 * - Case-insensitive tag normalization
 * - Collecting all unique tags with post counts
 * - Filtering posts by tag
 * - Sorting posts in reverse chronological order with filename tiebreaker
 */

/**
 * A post entry compatible with Astro content collections.
 * Has `data` (frontmatter fields) and `id` (filename/path identifier).
 */
export interface Post {
  id: string;
  data: {
    title: string;
    date: Date;
    description?: string;
    tags: string[];
    draft: boolean;
    featured: boolean;
    canonicalUrl?: string;
    slug?: string;
  };
}

/**
 * Normalize a tag to lowercase for case-insensitive matching.
 * "JavaScript" and "javascript" resolve to the same tag.
 *
 * @param tag - The tag string to normalize
 * @returns Lowercase version of the tag
 */
export function normalizeTag(tag: string): string {
  return tag.toLowerCase();
}

/**
 * Get all unique tags with their post counts.
 * Tags are normalized (lowercased) for case-insensitive matching.
 * Draft posts are excluded in production (when `import.meta.env.PROD` is true),
 * but since this utility is environment-agnostic, the caller should pre-filter
 * drafts before passing posts to this function.
 *
 * @param posts - Array of posts (should be pre-filtered for drafts if needed)
 * @returns Map of normalized tag → post count
 */
export function getAllTags(posts: Post[]): Map<string, number> {
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const normalized = normalizeTag(tag);
      tagCounts.set(normalized, (tagCounts.get(normalized) ?? 0) + 1);
    }
  }

  return tagCounts;
}

/**
 * Get all posts that have a specific tag (case-insensitive matching).
 * Results are sorted in reverse chronological order by date,
 * with ties broken by filename (id) in reverse alphabetical order.
 *
 * @param posts - Array of posts to filter (should be pre-filtered for drafts if needed)
 * @param tag - The tag to filter by (case-insensitive)
 * @returns Posts matching the tag, sorted newest first
 */
export function getPostsByTag(posts: Post[], tag: string): Post[] {
  const normalizedTag = normalizeTag(tag);

  const filtered = posts.filter((post) =>
    post.data.tags.some((t) => normalizeTag(t) === normalizedTag),
  );

  return sortPosts(filtered);
}

/**
 * Sort posts in reverse chronological order by date.
 * Ties (same date) are broken by filename (id) in reverse alphabetical order.
 *
 * @param posts - Array of posts to sort
 * @returns New sorted array (does not mutate input)
 */
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const dateA = a.data.date.getTime();
    const dateB = b.data.date.getTime();

    if (dateB !== dateA) {
      return dateB - dateA; // Reverse chronological (newest first)
    }

    // Tie-breaker: reverse alphabetical by id (filename)
    return b.id.localeCompare(a.id);
  });
}
