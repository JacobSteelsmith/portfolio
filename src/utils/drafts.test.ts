/**
 * Unit tests for draft filtering utilities.
 *
 * Tests the core logic of environment-aware draft filtering:
 * - isDraft detection
 * - filterDrafts in production vs development
 * - Tag filtering after draft exclusion
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { DraftFilterable } from './drafts';

// We need to mock import.meta.env.PROD for testing
// Since import.meta.env is read at call time, we'll use vi.hoisted + dynamic import

describe('drafts utility', () => {
  describe('isDraft', () => {
    it('returns true for a post with draft: true', async () => {
      vi.stubEnv('PROD', '');
      const { isDraft } = await import('./drafts');
      const post: DraftFilterable = { data: { draft: true } };
      expect(isDraft(post)).toBe(true);
    });

    it('returns false for a post with draft: false', async () => {
      vi.stubEnv('PROD', '');
      const { isDraft } = await import('./drafts');
      const post: DraftFilterable = { data: { draft: false } };
      expect(isDraft(post)).toBe(false);
    });

    it('returns false for a post with draft undefined', async () => {
      vi.stubEnv('PROD', '');
      const { isDraft } = await import('./drafts');
      const post: DraftFilterable = { data: {} };
      expect(isDraft(post)).toBe(false);
    });
  });

  describe('filterDrafts', () => {
    const posts: DraftFilterable[] = [
      { data: { draft: false, tags: ['javascript'] } },
      { data: { draft: true, tags: ['python'] } },
      { data: { draft: false, tags: ['typescript'] } },
      { data: { draft: true, tags: ['rust'] } },
      { data: { tags: ['go'] } }, // no draft field = published
    ];

    describe('in production', () => {
      beforeEach(() => {
        vi.resetModules();
        vi.stubEnv('PROD', 'true');
      });

      afterEach(() => {
        vi.unstubAllEnvs();
      });

      it('excludes all draft posts', async () => {
        const { filterDrafts } = await import('./drafts');
        const result = filterDrafts(posts);
        expect(result).toHaveLength(3);
        expect(result.every((p) => p.data.draft !== true)).toBe(true);
      });

      it('returns empty array when all posts are drafts', async () => {
        const { filterDrafts } = await import('./drafts');
        const allDrafts: DraftFilterable[] = [
          { data: { draft: true } },
          { data: { draft: true } },
        ];
        expect(filterDrafts(allDrafts)).toHaveLength(0);
      });
    });

    describe('in development', () => {
      beforeEach(() => {
        vi.resetModules();
        vi.stubEnv('PROD', '');
      });

      afterEach(() => {
        vi.unstubAllEnvs();
      });

      it('includes all posts including drafts', async () => {
        const { filterDrafts } = await import('./drafts');
        const result = filterDrafts(posts);
        expect(result).toHaveLength(5);
      });
    });
  });

  describe('getPublishedTags', () => {
    const posts: DraftFilterable[] = [
      { data: { draft: false, tags: ['javascript', 'web'] } },
      { data: { draft: true, tags: ['python', 'draft-only-tag'] } },
      { data: { draft: false, tags: ['typescript', 'web'] } },
    ];

    describe('in production', () => {
      beforeEach(() => {
        vi.resetModules();
        vi.stubEnv('PROD', 'true');
      });

      afterEach(() => {
        vi.unstubAllEnvs();
      });

      it('only includes tags from published posts', async () => {
        const { getPublishedTags } = await import('./drafts');
        const tags = getPublishedTags(posts);
        expect(tags.has('javascript')).toBe(true);
        expect(tags.has('web')).toBe(true);
        expect(tags.has('typescript')).toBe(true);
        expect(tags.has('python')).toBe(false);
        expect(tags.has('draft-only-tag')).toBe(false);
      });
    });

    describe('in development', () => {
      beforeEach(() => {
        vi.resetModules();
        vi.stubEnv('PROD', '');
      });

      afterEach(() => {
        vi.unstubAllEnvs();
      });

      it('includes tags from all posts including drafts', async () => {
        const { getPublishedTags } = await import('./drafts');
        const tags = getPublishedTags(posts);
        expect(tags.has('javascript')).toBe(true);
        expect(tags.has('python')).toBe(true);
        expect(tags.has('draft-only-tag')).toBe(true);
      });
    });
  });

  describe('filterTagsWithPublishedPosts', () => {
    const posts: DraftFilterable[] = [
      { data: { draft: false, tags: ['javascript', 'web'] } },
      { data: { draft: true, tags: ['python', 'draft-only'] } },
      { data: { draft: false, tags: ['typescript', 'web'] } },
    ];

    describe('in production', () => {
      beforeEach(() => {
        vi.resetModules();
        vi.stubEnv('PROD', 'true');
      });

      afterEach(() => {
        vi.unstubAllEnvs();
      });

      it('removes tags with zero published posts', async () => {
        const { filterTagsWithPublishedPosts } = await import('./drafts');
        const tagCounts = new Map([
          ['javascript', 1],
          ['web', 2],
          ['typescript', 1],
          ['python', 1],
          ['draft-only', 1],
        ]);

        const result = filterTagsWithPublishedPosts(tagCounts, posts);
        expect(result.has('javascript')).toBe(true);
        expect(result.has('web')).toBe(true);
        expect(result.has('typescript')).toBe(true);
        expect(result.has('python')).toBe(false);
        expect(result.has('draft-only')).toBe(false);
      });

      it('returns correct counts based on published posts only', async () => {
        const { filterTagsWithPublishedPosts } = await import('./drafts');
        const tagCounts = new Map([
          ['web', 2],
          ['javascript', 1],
        ]);

        const result = filterTagsWithPublishedPosts(tagCounts, posts);
        expect(result.get('web')).toBe(2);
        expect(result.get('javascript')).toBe(1);
      });
    });
  });
});
