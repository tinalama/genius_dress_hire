import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { API_RESPONSE_META } from '../constants/api-response-meta.constant';
import { UnauthorizedException } from '../exception/unauthorized.exception';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter<UnauthorizedException> {
  catch(exception: UnauthorizedException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.UNAUTHORIZED).json({
      errors: {
        title: 'unauthorized',
        code: HttpStatus.UNAUTHORIZED,
        detail: exception.message,
      },
      meta: API_RESPONSE_META,
    });
  }
}
