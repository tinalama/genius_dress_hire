/**
 * Search filter interface for common query parameters
 */
export interface SearchFilterInterface {
  keyword?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
  status?: string | string[];
}