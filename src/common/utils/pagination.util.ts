import { SearchFilterInterface } from '../interfaces/search-filter.interface';
import { PaginationMeta, PaginatedResult } from '../interfaces/paginated-result.interface';

/**
 * Pagination utility functions
 */
export class PaginationUtil {
  /**
   * Get pagination parameters from query
   * @param query Query parameters
   */
  static getPaginationParams(query: SearchFilterInterface): {
    page: number;
    limit: number;
    skip: number;
  } {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  /**
   * Create paginated result
   * @param items Items in current page
   * @param total Total number of items
   * @param page Current page number
   * @param limit Items per page
   */
  static createPaginatedResult<T>(
    items: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResult<T> {
    const meta: PaginationMeta = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    };

    return { items, meta };
  }

  /**
   * Calculate total pages
   * @param total Total items
   * @param limit Items per page
   */
  static calculateTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  /**
   * Validate pagination parameters
   * @param page Page number
   * @param limit Items per page
   */
  static validatePaginationParams(page: number, limit: number): {
    page: number;
    limit: number;
  } {
    return {
      page: Math.max(1, page),
      limit: Math.min(100, Math.max(1, limit)),
    };
  }
}