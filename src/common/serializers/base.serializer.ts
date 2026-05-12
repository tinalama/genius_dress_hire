import { plainToInstance } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer';

/**
 * Shared helpers for mapping entities or plain objects to response DTOs.
 */
export abstract class BaseSerializer {
  protected plainToDto<T, V>(
    cls: ClassConstructor<T>,
    plain: V,
    excludeExtraneous = true,
  ): T {
    return plainToInstance(cls, plain, {
      excludeExtraneousValues: excludeExtraneous,
    });
  }

  protected plainListToDto<T, V>(
    cls: ClassConstructor<T>,
    list: V[],
    excludeExtraneous = true,
  ): T[] {
    return list.map((item) => this.plainToDto(cls, item, excludeExtraneous));
  }
}
