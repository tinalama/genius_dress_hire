import { PaginationMeta } from './pagination-meta.interface';
export type { PaginationMeta };

/**
 * Paginated result interface
 * Standardized response for paginated lists
 */
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}