import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API_RESPONSE_META } from '../constants/api-response-meta.constant';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: unknown) => {
        if (
          response &&
          typeof response === 'object' &&
          'message' in response &&
          'data' in response
        ) {
          const { message, data, pagination } = response as {
            message: string;
            data: unknown;
            pagination?: unknown;
          };
          return {
            message,
            data,
            meta: pagination
              ? { ...API_RESPONSE_META, pagination }
              : API_RESPONSE_META,
          };
        }

        return { data: response, meta: API_RESPONSE_META };
      }),
    );
  }
}
