import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { filterDrafts } from '../utils/drafts';
import { sortPosts } from '../utils/tags';
import type { Post } from '../utils/tags';

/**
 * RSS Feed Generator
 *
 * Produces a valid RSS 2.0 feed at /rss.xml containing up to 20 most recent
 * published posts sorted by publication date descending.
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */
export async function GET(context: APIContext) {
  const allPosts = await getCollection('posts');
  const publishedPosts = filterDrafts(allPosts) as Post[];
  const sortedPosts = sortPosts(publishedPosts);
  const recentPosts = sortedPosts.slice(0, 20);

  return rss({
    title: 'Jacob Steelsmith Blog',
    description:
      'A technical blog covering software development, web technologies, cloud engineering, and AWS architecture.',
    site: context.site!.toString(),
    items: recentPosts.map((post) => {
      const slug = getPostSlug(post);
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description ?? '',
        link: `/posts/${slug}`,
      };
    }),
  });
}

/**
 * Derive the URL slug for a post.
 * Uses frontmatter slug if available, otherwise strips the YYYY-MM-DD- prefix from the id.
 */
function getPostSlug(post: Post): string {
  if (post.data.slug) {
    return post.data.slug;
  }
  // Remove date prefix (YYYY-MM-DD-) from the id
  const match = post.id.match(/^\d{4}-\d{2}-\d{2}-(.+?)(?:\.md)?$/);
  return match ? match[1] : post.id;
}
