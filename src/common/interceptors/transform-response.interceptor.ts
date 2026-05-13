import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const message = response?.message || 'Success';
        const data = response?.data !== undefined ? response.data : response;

        // Handle paginated responses
        if (response?.pagination || response?.meta?.pagination) {
          return {
            success: true,
            message,
            data: response?.data || response?.items || data,
            meta: {
              api: {
                version: '1.0.0',
              },
              paging: response?.pagination || response?.meta?.pagination,
            },
          };
        }

        // Standard response
        return {
          success: true,
          message,
          data,
          meta: {
            api: {
              version: '1.0.0',
            },
          },
        };
      }),
    );
  }
}
