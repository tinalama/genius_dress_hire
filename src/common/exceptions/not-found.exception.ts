import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception for when a resource is not found
 */
export class NotFoundException extends HttpException {
  constructor(message: string = 'Resource not found') {
    super(
      {
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message,
        code: 'NOT_FOUND',
      },
      HttpStatus.NOT_FOUND
    );
  }
}