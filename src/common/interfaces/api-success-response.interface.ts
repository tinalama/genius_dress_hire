/**
 * Standard success response interface
 * Used by TransformResponseInterceptor to wrap API responses
 */
export interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}