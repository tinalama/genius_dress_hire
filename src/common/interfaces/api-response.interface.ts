import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard API response wrapper for successful operations
 */
export class ApiResponse<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Success message' })
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty({
    example: {
      api: {
        version: '1.0.0'
      }
    }
  })
  meta?: any;

  constructor(message: string, data: T, meta?: any) {
    this.success = true;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }
}

/**
 * Paginated API response
 */
export class PaginatedApiResponse<T> extends ApiResponse<T[]> {
  declare meta: {
    api: {
      version: string;
    };
    pagination: {
      current_page: number;
      per_page: number;
      total_items: number;
      total_pages: number;
      has_next_page: boolean;
      has_previous_page: boolean;
    };
  };
}

/**
 * Error API response
 */
export class ApiErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Error message' })
  message: string;

  @ApiProperty({ example: 'ERROR_CODE' })
  code?: string;

  @ApiProperty({ example: { email: ['Email is required'] } })
  errors?: Record<string, string[]>;

  @ApiProperty({ example: '/api/resource' })
  path?: string;

  @ApiProperty({ example: '2026-05-13T12:00:00.000Z' })
  timestamp?: string;
}

/**
 * Error body interface for exception filters
 */
export interface ApiErrorBody {
  success: boolean;
  statusCode: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  path?: string;
  timestamp?: string;
}