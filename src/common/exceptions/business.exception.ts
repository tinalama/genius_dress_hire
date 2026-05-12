import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Domain or application rule violation with a stable error code for clients.
 */
export class BusinessException extends HttpException {
  constructor(
    message: string,
    public readonly code: string,
    status: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY,
  ) {
    super(
      {
        success: false,
        statusCode: status,
        message,
        code,
      },
      status,
    );
  }
}
