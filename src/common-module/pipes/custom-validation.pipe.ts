import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors && errors.length > 0) {
      const translatedError = this.flattenValidationErrors(errors);
      throw new UnprocessableEntityException(translatedError);
    }

    // Return the transformed instance so @Transform and class inheritance apply to query/body.
    return object;
  }

  private toValidate(metatype: unknown): boolean {
    const types: unknown[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  /**
   * Recursively flattens ValidationError[] into an array of readable error paths
   */
  private flattenValidationErrors(
    errors: ValidationError[],
    parentPath = ''
  ): { property: string; constraints: Record<string, string> }[] {
    const result = [];

    for (const error of errors) {
      const isIndex = !isNaN(Number(error.property));
      const currentPath = parentPath
        ? parentPath + (isIndex ? `[${error.property}]` : `.${error.property}`)
        : error.property;

      if (error.constraints) {
        result.push({
          property: currentPath,
          constraints: error.constraints
        });
      }

      if (error.children && error.children.length > 0) {
        result.push(
          ...this.flattenValidationErrors(error.children, currentPath)
        );
      }
    }

    return result;
  }
}
