import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { API_RESPONSE_META } from '../constants/api-response-meta.constant';
import { ForbiddenException } from '../exception/forbidden.exception';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter<ForbiddenException> {
  catch(exception: ForbiddenException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.FORBIDDEN).json({
      errors: {
        title: 'forbidden resource',
        code: HttpStatus.FORBIDDEN,
        detail: exception.message,
      },
      meta: API_RESPONSE_META,
    });
  }
}
