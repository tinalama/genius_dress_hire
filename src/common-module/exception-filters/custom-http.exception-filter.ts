import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { API_RESPONSE_META } from '../constants/api-response-meta.constant';
import { CustomHttpException } from '../exception/custom-http.exception';

@Catch(CustomHttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter<CustomHttpException> {
  catch(exception: CustomHttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    response.status(statusCode).json({
      errors: {
        title: 'Invalid Data.',
        code: statusCode,
        detail: exception.message,
      },
      meta: API_RESPONSE_META,
    });
  }
}
