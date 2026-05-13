import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * Pipe to trim string values in request data
 * Removes leading/trailing whitespace from all string properties
 * Note: Doesn't trim password fields
 */
@Injectable()
export class TrimInterceptor implements PipeTransform {
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(values: any): any {
    Object.keys(values).forEach((key) => {
      if (key !== 'password') {
        if (this.isObj(values[key])) {
          values[key] = this.trim(values[key]);
        } else {
          if (typeof values[key] === 'string') {
            values[key] = values[key].trim();
          }
        }
      }
    });
    return values;
  }

  transform(values: any, metadata: ArgumentMetadata): any {
    const { type } = metadata;
    if (
      (this.isObj(values) && type === 'body') ||
      type === 'query' ||
      type === 'custom'
    ) {
      return this.trim(values);
    }

    // Don't throw error for other types, just return as-is
    return values;
  }
}