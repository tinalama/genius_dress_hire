import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException
} from '@nestjs/common';
import { Response } from 'express';
import { API_RESPONSE_META } from '../constants/api-response-meta.constant';

@Catch(InternalServerErrorException)
export class InternalErrorExceptionsFilter implements ExceptionFilter {
  public catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: {
        title: 'internal server error',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        detail: exception.message,
      },
      meta: API_RESPONSE_META,
    });
  }
}
