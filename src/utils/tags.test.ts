import { describe, it, expect } from 'vitest';
import { normalizeTag, getAllTags, getPostsByTag, sortPosts, type Post } from './tags';

/** Helper to create a mock post */
function makePost(overrides: Partial<Post> & { id: string; data: Partial<Post['data']> }): Post {
  return {
    id: overrides.id,
    data: {
      title: overrides.data.title ?? 'Test Post',
      date: overrides.data.date ?? new Date('2023-01-01'),
      tags: overrides.data.tags ?? [],
      draft: overrides.data.draft ?? false,
      featured: overrides.data.featured ?? false,
      ...overrides.data,
    },
  };
}

describe('normalizeTag', () => {
  it('converts to lowercase', () => {
    expect(normalizeTag('JavaScript')).toBe('javascript');
  });

  it('handles already lowercase tags', () => {
    expect(normalizeTag('python')).toBe('python');
  });

  it('handles mixed case', () => {
    expect(normalizeTag('TypeScript')).toBe('typescript');
  });

  it('handles all uppercase', () => {
    expect(normalizeTag('AWS')).toBe('aws');
  });

  it('preserves hyphens and numbers', () => {
    expect(normalizeTag('Web-Dev-101')).toBe('web-dev-101');
  });

  it('handles empty string', () => {
    expect(normalizeTag('')).toBe('');
  });
});

describe('getAllTags', () => {
  it('returns empty map for no posts', () => {
    const result = getAllTags([]);
    expect(result.size).toBe(0);
  });

  it('counts tags across posts', () => {
    const posts: Post[] = [
      makePost({ id: 'post-1.md', data: { tags: ['javascript', 'web'] } }),
      makePost({ id: 'post-2.md', data: { tags: ['javascript', 'node'] } }),
      makePost({ id: 'post-3.md', data: { tags: ['web'] } }),
    ];
    const result = getAllTags(posts);
    expect(result.get('javascript')).toBe(2);
    expect(result.get('web')).toBe(2);
    expect(result.get('node')).toBe(1);
  });

  it('normalizes tags case-insensitively', () => {
    const posts: Post[] = [
      makePost({ id: 'post-1.md', data: { tags: ['JavaScript'] } }),
      makePost({ id: 'post-2.md', data: { tags: ['javascript'] } }),
      makePost({ id: 'post-3.md', data: { tags: ['JAVASCRIPT'] } }),
    ];
    const result = getAllTags(posts);
    expect(result.size).toBe(1);
    expect(result.get('javascript')).toBe(3);
  });

  it('handles posts with no tags', () => {
    const posts: Post[] = [
      makePost({ id: 'post-1.md', data: { tags: [] } }),
      makePost({ id: 'post-2.md', data: { tags: ['solo'] } }),
    ];
    const result = getAllTags(posts);
    expect(result.size).toBe(1);
    expect(result.get('solo')).toBe(1);
  });
});

describe('getPostsByTag', () => {
  const posts: Post[] = [
    makePost({ id: '2023-06-01-post-a.md', data: { date: new Date('2023-06-01'), tags: ['javascript', 'web'] } }),
    makePost({ id: '2023-05-15-post-b.md', data: { date: new Date('2023-05-15'), tags: ['JavaScript', 'node'] } }),
    makePost({ id: '2023-07-20-post-c.md', data: { date: new Date('2023-07-20'), tags: ['python'] } }),
  ];

  it('filters posts by tag (case-insensitive)', () => {
    const result = getPostsByTag(posts, 'javascript');
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('2023-06-01-post-a.md');
    expect(result[1].id).toBe('2023-05-15-post-b.md');
  });

  it('matches regardless of query case', () => {
    const result = getPostsByTag(posts, 'JAVASCRIPT');
    expect(result).toHaveLength(2);
  });

  it('returns empty array for non-existent tag', () => {
    const result = getPostsByTag(posts, 'rust');
    expect(result).toHaveLength(0);
  });

  it('returns results sorted in reverse chronological order', () => {
    const result = getPostsByTag(posts, 'javascript');
    expect(result[0].data.date.getTime()).toBeGreaterThanOrEqual(result[1].data.date.getTime());
  });
});

describe('sortPosts', () => {
  it('sorts by date descending (newest first)', () => {
    const posts: Post[] = [
      makePost({ id: 'old.md', data: { date: new Date('2020-01-01') } }),
      makePost({ id: 'new.md', data: { date: new Date('2023-06-15') } }),
      makePost({ id: 'mid.md', data: { date: new Date('2021-06-01') } }),
    ];
    const sorted = sortPosts(posts);
    expect(sorted[0].id).toBe('new.md');
    expect(sorted[1].id).toBe('mid.md');
    expect(sorted[2].id).toBe('old.md');
  });

  it('breaks ties by filename in reverse alphabetical order', () => {
    const posts: Post[] = [
      makePost({ id: '2023-01-01-alpha.md', data: { date: new Date('2023-01-01') } }),
      makePost({ id: '2023-01-01-zeta.md', data: { date: new Date('2023-01-01') } }),
      makePost({ id: '2023-01-01-beta.md', data: { date: new Date('2023-01-01') } }),
    ];
    const sorted = sortPosts(posts);
    expect(sorted[0].id).toBe('2023-01-01-zeta.md');
    expect(sorted[1].id).toBe('2023-01-01-beta.md');
    expect(sorted[2].id).toBe('2023-01-01-alpha.md');
  });

  it('does not mutate the original array', () => {
    const posts: Post[] = [
      makePost({ id: 'b.md', data: { date: new Date('2020-01-01') } }),
      makePost({ id: 'a.md', data: { date: new Date('2023-01-01') } }),
    ];
    const original = [...posts];
    sortPosts(posts);
    expect(posts[0].id).toBe(original[0].id);
    expect(posts[1].id).toBe(original[1].id);
  });

  it('handles empty array', () => {
    expect(sortPosts([])).toEqual([]);
  });

  it('handles single post', () => {
    const posts: Post[] = [makePost({ id: 'only.md', data: { date: new Date('2023-01-01') } })];
    const sorted = sortPosts(posts);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].id).toBe('only.md');
  });
});
