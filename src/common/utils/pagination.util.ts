import type { PaginationMeta } from '../interfaces/pagination-meta.interface';
import type { PaginatedResult } from '../interfaces/paginated-result.interface';

export function buildPaginationMeta(
  page: number,
  limit: number,
  totalItems: number,
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit) || 0;
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && totalPages > 0,
  };
}

export function toPaginatedResult<T>(
  items: T[],
  page: number,
  limit: number,
  totalItems: number,
): PaginatedResult<T> {
  return {
    items,
    meta: buildPaginationMeta(page, limit, totalItems),
  };
}
