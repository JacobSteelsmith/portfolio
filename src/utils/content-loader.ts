/**
 * Content Loader Utilities
 *
 * Provides helper functions for processing blog posts:
 * - Filename parsing (date + slug extraction)
 * - Auto-description generation from post body
 * - Frontmatter defaults application
 * - Validation and warning logging
 */

/** Regex for parsing post filenames: YYYY-MM-DD-slug.md */
export const FILENAME_REGEX = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;

/**
 * Result of parsing a post filename.
 */
export interface FilenameParseResult {
  date: string;
  slug: string;
}

/**
 * Parsed post data with all fields resolved (frontmatter + filename-derived + defaults).
 */
export interface ProcessedPost {
  title: string;
  date: Date;
  slug: string;
  description: string;
  tags: string[];
  draft: boolean;
  featured: boolean;
  canonicalUrl?: string;
}

/**
 * Raw frontmatter fields as they might appear in a post.
 */
export interface RawFrontmatter {
  title?: string;
  date?: string | Date;
  description?: string;
  tags?: string[];
  draft?: boolean;
  featured?: boolean;
  canonicalUrl?: string;
  slug?: string;
}

/**
 * Parse a post filename to extract date and slug.
 *
 * @param filename - The filename (without directory path), e.g. "2006-03-20-immortal-software.md"
 * @returns Parsed date and slug, or null if filename doesn't match the expected pattern
 */
export function parseFilename(filename: string): FilenameParseResult | null {
  const match = filename.match(FILENAME_REGEX);
  if (!match) {
    return null;
  }
  return {
    date: match[1],
    slug: match[2],
  };
}

/**
 * Strip markdown syntax from text to produce plain text.
 * Removes common markdown formatting: headers, bold, italic, links, images,
 * code blocks, inline code, blockquotes, list markers, horizontal rules, and HTML tags.
 */
export function stripMarkdown(text: string): string {
  let result = text;

  // Remove fenced code blocks (``` ... ```)
  result = result.replace(/```[\s\S]*?```/g, '');

  // Remove inline code
  result = result.replace(/`([^`]+)`/g, '$1');

  // Remove images ![alt](url)
  result = result.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Remove links [text](url) → keep text
  result = result.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Remove reference-style links [text][ref]
  result = result.replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1');

  // Remove HTML tags
  result = result.replace(/<[^>]+>/g, '');

  // Remove headings (# ... )
  result = result.replace(/^#{1,6}\s+/gm, '');

  // Remove bold/italic markers
  result = result.replace(/(\*\*|__)(.*?)\1/g, '$2');
  result = result.replace(/(\*|_)(.*?)\1/g, '$2');

  // Remove strikethrough
  result = result.replace(/~~(.*?)~~/g, '$1');

  // Remove blockquotes
  result = result.replace(/^>\s?/gm, '');

  // Remove unordered list markers
  result = result.replace(/^[\s]*[-*+]\s+/gm, '');

  // Remove ordered list markers
  result = result.replace(/^[\s]*\d+\.\s+/gm, '');

  // Remove horizontal rules
  result = result.replace(/^[-*_]{3,}\s*$/gm, '');

  // Collapse multiple newlines/whitespace into single spaces
  result = result.replace(/\s+/g, ' ');

  return result.trim();
}

/**
 * Generate a description from post body text.
 * Strips markdown, then truncates to 160 characters at the last word boundary.
 * If the plain text body is shorter than 160 characters, returns the entire body.
 *
 * @param body - The raw markdown body of the post (without frontmatter)
 * @returns Plain text description, at most 160 characters
 */
export function generateDescription(body: string): string {
  const plainText = stripMarkdown(body);

  if (plainText.length <= 160) {
    return plainText;
  }

  // Truncate at 160 chars, then find the last word boundary (space)
  const truncated = plainText.slice(0, 160);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace === -1) {
    // No space found — single long word, just truncate at 160
    return truncated;
  }

  return truncated.slice(0, lastSpace);
}

/**
 * Process a post by merging frontmatter values with filename-derived defaults.
 * Frontmatter values always take precedence over filename-derived values.
 *
 * @param filename - The post filename (e.g. "2006-03-20-immortal-software.md")
 * @param frontmatter - The parsed frontmatter object
 * @param body - The raw markdown body (used for auto-description)
 * @returns Processed post data, or null if the post should be skipped
 */
export function processPost(
  filename: string,
  frontmatter: RawFrontmatter,
  body: string,
): ProcessedPost | null {
  // Validate required title field
  if (!frontmatter.title || typeof frontmatter.title !== 'string' || frontmatter.title.trim() === '') {
    console.warn(`[content-loader] Skipping "${filename}": missing required "title" field in frontmatter`);
    return null;
  }

  // Parse filename for date and slug defaults
  const parsed = parseFilename(filename);

  // Resolve date: frontmatter takes precedence, then filename-derived
  let resolvedDate: Date;
  if (frontmatter.date) {
    resolvedDate = frontmatter.date instanceof Date ? frontmatter.date : new Date(frontmatter.date);
    if (isNaN(resolvedDate.getTime())) {
      console.warn(`[content-loader] Skipping "${filename}": invalid date in frontmatter`);
      return null;
    }
  } else if (parsed) {
    resolvedDate = new Date(parsed.date + 'T00:00:00.000Z');
  } else {
    console.warn(`[content-loader] Skipping "${filename}": no date in frontmatter and filename doesn't match YYYY-MM-DD-slug.md pattern`);
    return null;
  }

  // Resolve slug: frontmatter takes precedence, then filename-derived
  const resolvedSlug = frontmatter.slug || (parsed ? parsed.slug : null);
  if (!resolvedSlug) {
    console.warn(`[content-loader] Skipping "${filename}": no slug in frontmatter and cannot derive from filename`);
    return null;
  }

  // Resolve description: frontmatter takes precedence, then auto-generate from body
  const resolvedDescription = frontmatter.description || generateDescription(body);

  // Apply defaults for optional fields
  const resolvedTags: string[] = frontmatter.tags ?? [];
  const resolvedDraft: boolean = frontmatter.draft ?? false;
  const resolvedFeatured: boolean = frontmatter.featured ?? false;

  const result: ProcessedPost = {
    title: frontmatter.title,
    date: resolvedDate,
    slug: resolvedSlug,
    description: resolvedDescription,
    tags: resolvedTags,
    draft: resolvedDraft,
    featured: resolvedFeatured,
  };

  if (frontmatter.canonicalUrl) {
    result.canonicalUrl = frontmatter.canonicalUrl;
  }

  return result;
}

/**
 * Validate frontmatter fields against the schema constraints.
 * Returns an array of warning messages (empty if valid).
 *
 * @param frontmatter - The raw frontmatter to validate
 * @returns Array of validation warning strings
 */
export function validateFrontmatter(frontmatter: RawFrontmatter): string[] {
  const warnings: string[] = [];

  if (frontmatter.title && frontmatter.title.length > 200) {
    warnings.push(`title exceeds 200 characters (${frontmatter.title.length})`);
  }

  if (frontmatter.description && frontmatter.description.length > 320) {
    warnings.push(`description exceeds 320 characters (${frontmatter.description.length})`);
  }

  if (frontmatter.tags && frontmatter.tags.length > 10) {
    warnings.push(`tags array exceeds 10 items (${frontmatter.tags.length})`);
  }

  if (frontmatter.slug && !/^[a-z0-9-]+$/.test(frontmatter.slug)) {
    warnings.push(`slug contains invalid characters: "${frontmatter.slug}" (must be lowercase alphanumeric and hyphens only)`);
  }

  return warnings;
}

/**
 * Process multiple posts, logging warnings for skipped files and returning
 * a summary of results.
 *
 * @param posts - Array of { filename, frontmatter, body } objects
 * @returns Object with processed posts array and counts
 */
export function processAllPosts(
  posts: Array<{ filename: string; frontmatter: RawFrontmatter; body: string }>,
): { processed: ProcessedPost[]; loadedCount: number; skippedCount: number } {
  const processed: ProcessedPost[] = [];
  let skippedCount = 0;

  for (const post of posts) {
    // Validate frontmatter constraints
    const warnings = validateFrontmatter(post.frontmatter);
    if (warnings.length > 0) {
      console.warn(`[content-loader] Warning for "${post.filename}": ${warnings.join('; ')}`);
    }

    const result = processPost(post.filename, post.frontmatter, post.body);
    if (result) {
      processed.push(result);
    } else {
      skippedCount++;
    }
  }

  console.log(`[content-loader] Loaded ${processed.length} posts, skipped ${skippedCount} files`);

  return {
    processed,
    loadedCount: processed.length,
    skippedCount,
  };
}
