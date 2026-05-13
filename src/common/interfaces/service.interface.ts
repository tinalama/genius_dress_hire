/**
 * Common interface for service classes
 * Provides standard CRUD method signatures
 */
export interface IService<T, K> {
  findAll(filter: any): Promise<T[]>;
  findOne(id: string): Promise<T>;
  create(createDto: any): Promise<T>;
  update(id: string, updateDto: any): Promise<T>;
  remove(id: string): Promise<void>;
}