import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { LANGUAGE_GROUP } from '../custom-constant/app.constant';
import { CommonLanguageService } from '@app/modules/language';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly commonLanguageService: CommonLanguageService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<ApiResponse<T>>> {
    const request = context.switchToHttp().getRequest();
    const { originalUrl } = request;
    // Determine language group based on URL path
    let group = LANGUAGE_GROUP.EMPLOYEE; // Default group
    if (originalUrl.startsWith('/supplier/api/v1')) {
      group = LANGUAGE_GROUP.SUPPLIER;
    } else if (originalUrl.startsWith('/kosoku/api/v1')) {
      group = LANGUAGE_GROUP.KOSOKU;
    } else if (originalUrl.startsWith('/ai-studio/api/v1')) {
      group = LANGUAGE_GROUP.AI_STUDIO;
    } else {
      group = LANGUAGE_GROUP.EMPLOYEE;
    }
    const langVersion = await this.commonLanguageService.getLangVersion(group);
    const meta: {
      api: { version: string };
      lang?: { version: string };
      pagination?: any;
    } = {
      api: {
        version: '1'
      },
      lang: {
        version: langVersion || '0' // Include lang version
      }
    };

    return next.handle().pipe(
      map((response) => {
        const messageData = response?.message || 'Data fetched successfully';
        if (response?.pagination) {
          meta.pagination = response.pagination;
        }

        if (response?.message && response?.data) {
          return {
            message: messageData,
            data: response.data,
            meta: response?.meta?.lang ? { ...meta, ...response?.meta } : meta
          };
        } else if (response) {
          if (!response.message) {
            return {
              message: messageData,
              data: response,
              meta: response?.meta?.lang ? { ...meta, ...response?.meta } : meta
            };
          }
        }

        return {
          message: messageData,
          meta
        };
      })
    );
  }
}
