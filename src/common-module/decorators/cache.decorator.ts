import { SetMetadata } from '@nestjs/common';
import { Request } from 'express';

export const CACHE_KEY_METADATA = 'cache_key';
export const CACHE_TTL_METADATA = 'cache_ttl';
export const CACHE_CONDITION_METADATA = 'cache_condition';

export interface CacheOptions {
  /** Cache key - string or function receiving request to generate dynamic key */
  key?: string | ((req: Request) => string);
  /** TTL in seconds */
  ttl?: number;
  /** Condition to skip caching (e.g. when forceRefresh is true) */
  condition?: (req: Request) => boolean;
}

export const Cache = (options: CacheOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY_METADATA, options.key)(
      target,
      propertyKey,
      descriptor
    );
    SetMetadata(CACHE_TTL_METADATA, options.ttl ?? 300)(
      target,
      propertyKey,
      descriptor
    );
    SetMetadata(CACHE_CONDITION_METADATA, options.condition)(
      target,
      propertyKey,
      descriptor
    );
    return descriptor;
  };
};
