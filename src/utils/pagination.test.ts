import { describe, it, expect } from 'vitest';
import { paginate, type PaginationConfig, type PaginatedResult } from './pagination';

describe('paginate', () => {
  it('returns single page for empty items', () => {
    const result = paginate([]);
    expect(result).toHaveLength(1);
    expect(result[0].items).toEqual([]);
    expect(result[0].currentPage).toBe(1);
    expect(result[0].totalPages).toBe(1);
    expect(result[0].hasNext).toBe(false);
    expect(result[0].hasPrev).toBe(false);
    expect(result[0].path).toBe('/blog');
  });

  it('uses default pageSize of 10 and basePath of /blog', () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const result = paginate(items);
    expect(result).toHaveLength(3);
    expect(result[0].items).toHaveLength(10);
    expect(result[1].items).toHaveLength(10);
    expect(result[2].items).toHaveLength(5);
  });

  it('first page is at basePath, subsequent at basePath/n', () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const result = paginate(items);
    expect(result[0].path).toBe('/blog');
    expect(result[1].path).toBe('/blog/2');
    expect(result[2].path).toBe('/blog/3');
  });

  it('correctly sets hasNext and hasPrev', () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const result = paginate(items);

    // First page
    expect(result[0].hasNext).toBe(true);
    expect(result[0].hasPrev).toBe(false);

    // Middle page
    expect(result[1].hasNext).toBe(true);
    expect(result[1].hasPrev).toBe(true);

    // Last page
    expect(result[2].hasNext).toBe(false);
    expect(result[2].hasPrev).toBe(true);
  });

  it('correctly sets currentPage and totalPages', () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const result = paginate(items);

    expect(result[0].currentPage).toBe(1);
    expect(result[0].totalPages).toBe(3);
    expect(result[1].currentPage).toBe(2);
    expect(result[1].totalPages).toBe(3);
    expect(result[2].currentPage).toBe(3);
    expect(result[2].totalPages).toBe(3);
  });

  it('handles exactly one page of items', () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    const result = paginate(items);
    expect(result).toHaveLength(1);
    expect(result[0].items).toHaveLength(10);
    expect(result[0].hasNext).toBe(false);
    expect(result[0].hasPrev).toBe(false);
  });

  it('handles fewer items than pageSize', () => {
    const items = [1, 2, 3];
    const result = paginate(items);
    expect(result).toHaveLength(1);
    expect(result[0].items).toEqual([1, 2, 3]);
    expect(result[0].totalPages).toBe(1);
  });

  it('respects custom pageSize', () => {
    const items = Array.from({ length: 15 }, (_, i) => i);
    const result = paginate(items, { pageSize: 5 });
    expect(result).toHaveLength(3);
    expect(result[0].items).toHaveLength(5);
    expect(result[1].items).toHaveLength(5);
    expect(result[2].items).toHaveLength(5);
  });

  it('respects custom basePath', () => {
    const items = Array.from({ length: 15 }, (_, i) => i);
    const result = paginate(items, { basePath: '/tags/javascript' });
    expect(result[0].path).toBe('/tags/javascript');
    expect(result[1].path).toBe('/tags/javascript/2');
  });

  it('preserves item order', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    const result = paginate(items, { pageSize: 2 });
    expect(result[0].items).toEqual(['a', 'b']);
    expect(result[1].items).toEqual(['c', 'd']);
    expect(result[2].items).toEqual(['e']);
  });

  it('works with complex objects', () => {
    const items = [
      { title: 'Post 1', date: new Date('2023-01-01') },
      { title: 'Post 2', date: new Date('2023-02-01') },
    ];
    const result = paginate(items, { pageSize: 1 });
    expect(result).toHaveLength(2);
    expect(result[0].items[0].title).toBe('Post 1');
    expect(result[1].items[0].title).toBe('Post 2');
  });

  it('handles pageSize of 1', () => {
    const items = [1, 2, 3];
    const result = paginate(items, { pageSize: 1 });
    expect(result).toHaveLength(3);
    expect(result[0].items).toEqual([1]);
    expect(result[1].items).toEqual([2]);
    expect(result[2].items).toEqual([3]);
  });
});
