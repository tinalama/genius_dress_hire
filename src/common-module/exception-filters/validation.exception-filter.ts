import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  UnprocessableEntityException
} from '@nestjs/common';
import { Response } from 'express';
import { API_RESPONSE_META } from '../constants/api-response-meta.constant';

@Catch(UnprocessableEntityException)
export class ValidationExceptionFilter implements ExceptionFilter<UnprocessableEntityException> {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errors: any = [];
    const validationError: any = exception.getResponse();

    if (validationError.message?.length) {
      for (const errorPayload of validationError.message) {
        errors.push({
          property: errorPayload.property,
          constraints: Object.keys(errorPayload.constraints).join(', '),
          messages: Object.values(errorPayload.constraints).join(', ')
        });
      }
    }
    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      title: exception.message,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors,
      meta: API_RESPONSE_META,
    });
  }
}
