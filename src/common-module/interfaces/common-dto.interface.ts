import { ApiProperty } from '@nestjs/swagger';

/**
 * common data transfer object interface
 */
export interface CommonDtoInterface {
  [key: string]: unknown;
}

export class ErrorResponse {
  @ApiProperty({ example: 'BAD_REQUEST' })
  error!: string;

  @ApiProperty({ example: 'Error message' })
  message!: string;

  @ApiProperty({ example: 400 })
  code!: number;

  @ApiProperty({ example: 1014 })
  statusCode!: number;
}

export class TooManyRequestResponse {
  @ApiProperty({ example: 'TOO_MANY_REQUESTS' })
  error!: string;

  @ApiProperty({ example: 'Too many attempts' })
  message!: string;

  @ApiProperty({ example: 429 })
  code!: number;

  @ApiProperty({ example: 429 })
  statusCode!: number;
}

export class SuccessMessage {
  @ApiProperty()
  message!: string;

  @ApiProperty({
    example: {
      api: {
        version: '1',
      },
    },
  })
  meta!: any;
}

export class ValidationError {
  @ApiProperty({ example: 'email' })
  field!: string;

  @ApiProperty({ example: ['Email must be valid email.'] })
  message!: string[];
}

export class InvalidRequestResponse {
  @ApiProperty({ example: 'Invalid request data' })
  message!: string;

  @ApiProperty({
    type: [ValidationError],
    example: [
      {
        field: 'email',
        message: ['Email must be valid email.'],
      },
    ],
  })
  errors!: ValidationError[];

  @ApiProperty({ example: 1002 })
  code!: number;

  @ApiProperty({ example: 422 })
  statusCode!: number;
}

export class SuccessResponse extends SuccessMessage {
  @ApiProperty({ example: 'Data fetched Successfully.' })
  declare message: string;

  @ApiProperty()
  declare data: any;

  @ApiProperty({
    example: {
      api: {
        version: '1',
      },
    },
  })
  declare meta: any;
}

export class ListResponse extends SuccessMessage {
  @ApiProperty({ example: 'Data fetched Successfully.' })
  declare message: string;

  @ApiProperty()
  declare data: any;

  @ApiProperty({
    example: {
      meta: {
        api: {
          version: '1',
        },
        pagination: {
          current_page: 1,
          per_page: 20,
          total: 1,
          total_pages: 1,
          prevPage: 0,
          nextPage: 0,
        },
      },
    },
  })
  declare meta: any;
}

export class ForbiddenResponse {
  @ApiProperty({ example: 'Forbidden' })
  error!: string;

  @ApiProperty({ example: 'Forbidden resource' })
  message!: string;

  @ApiProperty({ example: 1003 })
  code!: number;

  @ApiProperty({ example: 403 })
  statusCode!: number;
}

export class UploadFileResponse extends SuccessResponse {
  @ApiProperty({
    example: [
      {
        image_url:
          'https://example.com/temp/9b83ced0-4f6e-4a21-b633-2b494a9820fa.png',
        file_name: '9b83ced0-4f6e-4a21-b633-2b494a9820fa.png',
        original_file_name: 'image (1).png',
      },
    ],
  })
  declare data: any;
}

export class CreateErrorResponse {
  @ApiProperty({ example: 'Invalid request data' })
  message!: string;

  @ApiProperty({
    example: {
      field: 'expense_type',
      message: ['Expense Type must be company'],
    },
  })
  errors!: unknown;

  @ApiProperty({ example: 1002 })
  code!: number;

  @ApiProperty({ example: 422 })
  statusCode!: number;
}
