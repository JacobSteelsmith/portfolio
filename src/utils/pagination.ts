/**
 * Pagination Utilities
 *
 * Provides a generic pagination function for splitting items into pages.
 * Used primarily for blog listing pages but works with any item type.
 */

/**
 * Configuration for pagination behavior.
 */
export interface PaginationConfig {
  /** Number of items per page. Default: 10 */
  pageSize: number;
  /** Base URL path for paginated pages. Default: '/blog' */
  basePath: string;
}

/**
 * Result for a single page in a paginated set.
 */
export interface PaginatedResult<T> {
  /** Items on this page */
  items: T[];
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Whether there is a previous page */
  hasPrev: boolean;
  /** URL path for this page */
  path: string;
}

/** Default pagination configuration */
const DEFAULT_CONFIG: PaginationConfig = {
  pageSize: 10,
  basePath: '/blog',
};

/**
 * Split items into paginated results.
 *
 * - First page is at `basePath` (e.g. `/blog`)
 * - Subsequent pages are at `basePath/2/`, `basePath/3/`, etc.
 * - Each result includes navigation metadata (hasNext, hasPrev, currentPage, totalPages)
 *
 * @param items - Array of items to paginate (should already be sorted)
 * @param config - Pagination configuration (pageSize and basePath)
 * @returns Array of PaginatedResult objects, one per page
 */
export function paginate<T>(
  items: T[],
  config: Partial<PaginationConfig> = {},
): PaginatedResult<T>[] {
  const { pageSize, basePath } = { ...DEFAULT_CONFIG, ...config };

  if (items.length === 0) {
    return [
      {
        items: [],
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        path: basePath,
      },
    ];
  }

  const totalPages = Math.ceil(items.length / pageSize);
  const results: PaginatedResult<T>[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageItems = items.slice(startIndex, endIndex);

    // First page at basePath, subsequent at basePath/2/, basePath/3/, etc.
    const path = page === 1 ? basePath : `${basePath}/${page}`;

    results.push({
      items: pageItems,
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      path,
    });
  }

  return results;
}
