import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiErrorBody } from '../interfaces/api-response.interface';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let code: string | undefined;
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null && 'message' in res) {
        const body = res as Record<string, unknown>;
        message = body['message'] as string | string[];
        if (typeof body['code'] === 'string') {
          code = body['code'];
        }
      }
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.CONFLICT;
      message = 'Database constraint violation';
      this.logger.warn(`Query failed: ${exception.message}`);
    } else if (exception instanceof Error) {
      this.logger.error(exception.stack ?? exception.message, exception.stack);
      message =
        process.env['NODE_ENV'] === 'production'
          ? 'Internal server error'
          : exception.message;
    }

    if (status === HttpStatus.BAD_REQUEST && Array.isArray(message)) {
      errors = { _global: message };
      message = 'Validation failed';
    }

    const body: ApiErrorBody = {
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message.join(', ') : message,
      ...(code && { code }),
      ...(errors && { errors }),
    };

    response.status(status).json({
      ...body,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
