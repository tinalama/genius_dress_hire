import { Expose } from 'class-transformer';

/**
 * model serializer
 */
export class ModelSerializer {
  @Expose()
  id!: number;

  @Expose()
  _id?: string;

  [key: string]: unknown;
}
