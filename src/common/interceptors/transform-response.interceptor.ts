import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ApiSuccessResponse } from '../interfaces/api-response.interface';
import type { PaginatedResult } from '../interfaces/paginated-result.interface';

function isPaginatedResult<T>(value: unknown): value is PaginatedResult<T> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const v = value as PaginatedResult<T>;
  return Array.isArray(v.items) && v.meta !== undefined;
}

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<unknown>> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (isPaginatedResult(data)) {
          const result: ApiSuccessResponse<unknown[]> = {
            success: true,
            data: data.items,
            meta: data.meta,
          };
          return result;
        }
        const wrapped: ApiSuccessResponse<unknown> = {
          success: true,
          data,
        };
        return wrapped;
      }),
    );
  }
}
