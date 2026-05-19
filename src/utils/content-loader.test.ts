import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  parseFilename,
  stripMarkdown,
  generateDescription,
  processPost,
  validateFrontmatter,
  processAllPosts,
  FILENAME_REGEX,
} from './content-loader';

describe('parseFilename', () => {
  it('extracts date and slug from a valid filename', () => {
    const result = parseFilename('2006-03-20-immortal-software.md');
    expect(result).toEqual({ date: '2006-03-20', slug: 'immortal-software' });
  });

  it('handles slugs with multiple hyphens', () => {
    const result = parseFilename('2006-04-19-some-ip-parsing-fun-using-coldfusion.md');
    expect(result).toEqual({ date: '2006-04-19', slug: 'some-ip-parsing-fun-using-coldfusion' });
  });

  it('returns null for filenames without date prefix', () => {
    expect(parseFilename('no-date-here.md')).toBeNull();
  });

  it('returns null for filenames with invalid date format', () => {
    expect(parseFilename('06-03-20-short-year.md')).toBeNull();
  });

  it('returns null for non-md files', () => {
    expect(parseFilename('2006-03-20-immortal-software.txt')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseFilename('')).toBeNull();
  });

  it('handles single-word slugs', () => {
    const result = parseFilename('2023-01-15-hello.md');
    expect(result).toEqual({ date: '2023-01-15', slug: 'hello' });
  });
});

describe('FILENAME_REGEX', () => {
  it('matches valid filenames', () => {
    expect(FILENAME_REGEX.test('2006-03-20-immortal-software.md')).toBe(true);
    expect(FILENAME_REGEX.test('2023-12-31-year-end-review.md')).toBe(true);
  });

  it('does not match invalid filenames', () => {
    expect(FILENAME_REGEX.test('no-date.md')).toBe(false);
    expect(FILENAME_REGEX.test('2006-03-20-.md')).toBe(false);
    expect(FILENAME_REGEX.test('2006-3-20-short-month.md')).toBe(false);
  });
});

describe('stripMarkdown', () => {
  it('removes heading markers', () => {
    expect(stripMarkdown('# Hello World')).toBe('Hello World');
    expect(stripMarkdown('## Second Level')).toBe('Second Level');
  });

  it('removes bold and italic markers', () => {
    expect(stripMarkdown('**bold** and *italic*')).toBe('bold and italic');
    expect(stripMarkdown('__bold__ and _italic_')).toBe('bold and italic');
  });

  it('removes links but keeps text', () => {
    expect(stripMarkdown('[click here](https://example.com)')).toBe('click here');
  });

  it('removes images but keeps alt text', () => {
    expect(stripMarkdown('![alt text](image.png)')).toBe('alt text');
  });

  it('removes inline code backticks', () => {
    expect(stripMarkdown('use `console.log` here')).toBe('use console.log here');
  });

  it('removes fenced code blocks', () => {
    const input = 'before\n```js\nconst x = 1;\n```\nafter';
    expect(stripMarkdown(input)).toBe('before after');
  });

  it('removes blockquotes', () => {
    expect(stripMarkdown('> quoted text')).toBe('quoted text');
  });

  it('removes list markers', () => {
    expect(stripMarkdown('- item one\n- item two')).toBe('item one item two');
    expect(stripMarkdown('1. first\n2. second')).toBe('first second');
  });

  it('removes HTML tags', () => {
    expect(stripMarkdown('<p>paragraph</p>')).toBe('paragraph');
  });

  it('collapses whitespace', () => {
    expect(stripMarkdown('hello   \n\n   world')).toBe('hello world');
  });

  it('handles empty string', () => {
    expect(stripMarkdown('')).toBe('');
  });
});

describe('generateDescription', () => {
  it('returns full text when body is shorter than 160 chars', () => {
    const body = 'This is a short post body.';
    expect(generateDescription(body)).toBe('This is a short post body.');
  });

  it('truncates at word boundary for long text', () => {
    const body = 'a '.repeat(100); // 200 chars
    const result = generateDescription(body);
    expect(result.length).toBeLessThanOrEqual(160);
    // Should not end with a space (truncated at word boundary)
    expect(result.endsWith(' ')).toBe(false);
  });

  it('strips markdown before truncating', () => {
    const body = '**Bold text** and [a link](http://example.com) with *emphasis*.';
    const result = generateDescription(body);
    expect(result).not.toContain('**');
    expect(result).not.toContain('[');
    expect(result).not.toContain('(http');
  });

  it('handles body exactly 160 chars', () => {
    const body = 'x'.repeat(160);
    expect(generateDescription(body)).toBe(body);
  });

  it('handles empty body', () => {
    expect(generateDescription('')).toBe('');
  });

  it('truncates at last space before 160 chars', () => {
    // Create text that's longer than 160 chars with known word boundaries
    const words = 'The quick brown fox jumps over the lazy dog. ';
    const body = words.repeat(10); // well over 160 chars
    const result = generateDescription(body);
    expect(result.length).toBeLessThanOrEqual(160);
    // Should not end with a space (we truncate at word boundary, keeping the last complete word)
    expect(result.endsWith(' ')).toBe(false);
    // Should not contain a partial word at the end — verify by checking
    // that adding the next char from the original would start a new word
    const nextCharIndex = result.length;
    const plainText = result; // already stripped
    const fullPlain = body.replace(/\s+/g, ' ').trim();
    if (nextCharIndex < fullPlain.length) {
      // The character right after our truncation should be a space (we cut at word boundary)
      expect(fullPlain[nextCharIndex]).toBe(' ');
    }
  });
});

describe('processPost', () => {
  it('processes a valid post with minimal frontmatter', () => {
    const result = processPost(
      '2006-03-20-immortal-software.md',
      { title: 'Immortal Software', date: '2006-03-20' },
      'Some body text here.',
    );
    expect(result).not.toBeNull();
    expect(result!.title).toBe('Immortal Software');
    expect(result!.slug).toBe('immortal-software');
    expect(result!.description).toBe('Some body text here.');
    expect(result!.tags).toEqual([]);
    expect(result!.draft).toBe(false);
    expect(result!.featured).toBe(false);
  });

  it('uses frontmatter slug over filename-derived slug', () => {
    const result = processPost(
      '2006-03-20-immortal-software.md',
      { title: 'Test', date: '2006-03-20', slug: 'custom-slug' },
      'body',
    );
    expect(result!.slug).toBe('custom-slug');
  });

  it('uses frontmatter description over auto-generated', () => {
    const result = processPost(
      '2006-03-20-test.md',
      { title: 'Test', date: '2006-03-20', description: 'Custom description' },
      'This body text would be used for auto-description.',
    );
    expect(result!.description).toBe('Custom description');
  });

  it('uses frontmatter date over filename date', () => {
    const result = processPost(
      '2006-03-20-test.md',
      { title: 'Test', date: '2023-01-01' },
      'body',
    );
    expect(result!.date).toEqual(new Date('2023-01-01'));
  });

  it('applies default values for optional fields', () => {
    const result = processPost(
      '2006-03-20-test.md',
      { title: 'Test', date: '2006-03-20' },
      'body',
    );
    expect(result!.tags).toEqual([]);
    expect(result!.draft).toBe(false);
    expect(result!.featured).toBe(false);
    expect(result!.canonicalUrl).toBeUndefined();
  });

  it('preserves frontmatter tags, draft, and featured values', () => {
    const result = processPost(
      '2006-03-20-test.md',
      { title: 'Test', date: '2006-03-20', tags: ['js', 'web'], draft: true, featured: true },
      'body',
    );
    expect(result!.tags).toEqual(['js', 'web']);
    expect(result!.draft).toBe(true);
    expect(result!.featured).toBe(true);
  });

  it('preserves canonicalUrl from frontmatter', () => {
    const result = processPost(
      '2006-03-20-test.md',
      { title: 'Test', date: '2006-03-20', canonicalUrl: 'https://example.com/post' },
      'body',
    );
    expect(result!.canonicalUrl).toBe('https://example.com/post');
  });

  it('returns null and warns when title is missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = processPost('2006-03-20-test.md', {}, 'body');
    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('missing required "title" field'));
    warnSpy.mockRestore();
  });

  it('returns null and warns when title is empty string', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = processPost('2006-03-20-test.md', { title: '  ' }, 'body');
    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('returns null when no date available from frontmatter or filename', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = processPost('random-file.md', { title: 'Test' }, 'body');
    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('no date in frontmatter'));
    warnSpy.mockRestore();
  });

  it('returns null when date in frontmatter is invalid', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = processPost('2006-03-20-test.md', { title: 'Test', date: 'not-a-date' }, 'body');
    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('invalid date'));
    warnSpy.mockRestore();
  });

  it('derives date from filename when frontmatter date is absent', () => {
    const result = processPost(
      '2006-03-20-test.md',
      { title: 'Test' },
      'body',
    );
    expect(result).not.toBeNull();
    expect(result!.date).toEqual(new Date('2006-03-20T00:00:00.000Z'));
  });

  it('handles Date object in frontmatter', () => {
    const date = new Date('2023-06-15');
    const result = processPost(
      '2006-03-20-test.md',
      { title: 'Test', date },
      'body',
    );
    expect(result!.date).toEqual(date);
  });
});

describe('validateFrontmatter', () => {
  it('returns empty array for valid frontmatter', () => {
    expect(validateFrontmatter({ title: 'Valid', tags: ['a', 'b'] })).toEqual([]);
  });

  it('warns when title exceeds 200 characters', () => {
    const warnings = validateFrontmatter({ title: 'x'.repeat(201) });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('title exceeds 200 characters');
  });

  it('warns when description exceeds 320 characters', () => {
    const warnings = validateFrontmatter({ title: 'Test', description: 'x'.repeat(321) });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('description exceeds 320 characters');
  });

  it('warns when tags array exceeds 10 items', () => {
    const warnings = validateFrontmatter({ title: 'Test', tags: Array(11).fill('tag') });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('tags array exceeds 10 items');
  });

  it('warns when slug has invalid characters', () => {
    const warnings = validateFrontmatter({ title: 'Test', slug: 'Invalid Slug!' });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('slug contains invalid characters');
  });

  it('accepts valid slug with lowercase and hyphens', () => {
    const warnings = validateFrontmatter({ title: 'Test', slug: 'valid-slug-123' });
    expect(warnings).toEqual([]);
  });
});

describe('processAllPosts', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('processes valid posts and counts results', () => {
    const posts = [
      { filename: '2006-03-20-post-one.md', frontmatter: { title: 'Post One', date: '2006-03-20' }, body: 'Body one' },
      { filename: '2006-04-19-post-two.md', frontmatter: { title: 'Post Two', date: '2006-04-19' }, body: 'Body two' },
    ];
    const result = processAllPosts(posts);
    expect(result.loadedCount).toBe(2);
    expect(result.skippedCount).toBe(0);
    expect(result.processed).toHaveLength(2);
  });

  it('skips invalid posts and counts them', () => {
    const posts = [
      { filename: '2006-03-20-valid.md', frontmatter: { title: 'Valid', date: '2006-03-20' }, body: 'Body' },
      { filename: 'invalid.md', frontmatter: {}, body: 'Body' }, // missing title
      { filename: 'no-date.md', frontmatter: { title: 'No Date' }, body: 'Body' }, // no date
    ];
    const result = processAllPosts(posts);
    expect(result.loadedCount).toBe(1);
    expect(result.skippedCount).toBe(2);
  });

  it('logs total counts', () => {
    const logSpy = vi.spyOn(console, 'log');
    const posts = [
      { filename: '2006-03-20-test.md', frontmatter: { title: 'Test', date: '2006-03-20' }, body: 'Body' },
    ];
    processAllPosts(posts);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Loaded 1 posts, skipped 0 files'));
  });
});
