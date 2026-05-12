import type { PaginationMeta } from './pagination-meta.interface';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorBody {
  success: false;
  statusCode: number;
  message: string | string[];
  code?: string;
  errors?: Record<string, string[]>;
}
