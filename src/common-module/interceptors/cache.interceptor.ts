import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  Inject,
  Logger
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CacheService } from '../cache/cache.service';
import {
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
  CACHE_CONDITION_METADATA
} from '../decorators/cache.decorator';
import { Request } from 'express';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(CacheService) private readonly cacheService: CacheService
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<unknown>> {
    const cacheKeyFn = this.reflector.get<string | ((req: Request) => string)>(
      CACHE_KEY_METADATA,
      context.getHandler()
    );

    const ttl = this.reflector.get<number>(
      CACHE_TTL_METADATA,
      context.getHandler()
    );

    const condition = this.reflector.get<(req: Request) => boolean>(
      CACHE_CONDITION_METADATA,
      context.getHandler()
    );

    if (!cacheKeyFn) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();

    if (condition && !condition(request)) {
      this.logger.debug('Cache skipped: condition not met');
      return next.handle();
    }

    const key =
      typeof cacheKeyFn === 'function' ? cacheKeyFn(request) : cacheKeyFn;

    const cachedData = await this.cacheService.get(key);
    if (cachedData !== undefined) {
      this.logger.debug(`Returning cached data for key`);
      return of(cachedData);
    }

    return next.handle().pipe(
      mergeMap(async (data) => {
        if (data !== undefined) {
          await this.cacheService.set(key, data, ttl);
          this.logger.debug(`Cached response for key:`);
        }
        return data;
      })
    );
  }
}
