import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { API_RESPONSE_META } from '../constants/api-response-meta.constant';
import { NotFoundException } from '../exception/not-found.exception';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter<NotFoundException> {
  catch(exception: NotFoundException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.NOT_FOUND).json({
      errors: {
        title: 'item not found',
        code: HttpStatus.NOT_FOUND,
        detail: exception.message,
      },
      meta: API_RESPONSE_META,
    });
  }
}
