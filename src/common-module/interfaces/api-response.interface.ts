export interface ApiResponse<T> {
  message: string;
  data?: T;
  meta: {
    pagination?: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
      previous: number;
      next: number;
    };
    api: {
      version: string;
    };
  };
}

export interface ResponseData {
  data: any;
  message: string;
  pagination?: any;
}
