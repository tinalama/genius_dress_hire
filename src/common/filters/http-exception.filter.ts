import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';

/**
 * Focused filter for {@link HttpException}. The app registers {@link AllExceptionsFilter}
 * globally for a single error envelope; keep this class when splitting filters by type.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();
    response
      .status(status)
      .json(
        typeof body === 'object' && body !== null ? body : { message: body },
      );
  }
}
