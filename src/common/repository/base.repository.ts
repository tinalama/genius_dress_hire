import {
  DeepPartial,
  FindManyOptions,
  ILike,
  In,
  ObjectLiteral,
  Repository,
  FindOptionsWhere
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { NotFoundException } from '../exceptions/not-found.exception';
import { BadRequestException } from '@nestjs/common';

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Base Repository with common CRUD operations
 * Extends TypeORM's Repository to provide reusable methods
 */
export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  /**
   * Find entity by UUID
   * @param id Entity UUID
   * @param relations Relations to load
   * @throws NotFoundException if entity not found
   */
  async getById(id: string, relations: string[] = []): Promise<T> {
    const entity = await this.findOne({
      where: { id } as any,
      relations,
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return entity;
  }

  /**
   * Find entity by condition
   * @param fieldName Field name to search
   * @param value Field value
   * @param relations Relations to load
   * @throws NotFoundException if entity not found
   */
  async findByCondition(fieldName: string, value: any, relations: string[] = []): Promise<T> {
    const entity = await this.findOne({
      where: { [fieldName]: value } as any,
      relations,
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ${fieldName} ${value} not found`);
    }

    return entity;
  }

  /**
   * Find multiple entities by condition
   * @param fieldName Field name to search
   * @param values Array of field values
   * @param relations Relations to load
   */
  async findByConditionMany(fieldName: string, values: any[], relations: string[] = []): Promise<T[]> {
    return this.find({
      where: { [fieldName]: In(values) } as any,
      relations,
    });
  }

  /**
   * Count entities by condition
   * @param conditions Search conditions
   */
  async countByCondition(conditions: ObjectLiteral = {}): Promise<number> {
    return this.count({
      where: conditions as any,
    });
  }

  /**
   * Find all entities with optional filters
   * @param options Find options
   */
  async findAllWithFilters(options: FindManyOptions<T> = {}): Promise<T[]> {
    return this.find(options);
  }

  /**
   * Search entities by keyword across multiple fields
   * @param searchFilter Search filters
   * @param searchCriteria Fields to search in
   * @param relations Relations to load
   */
  async search(
    searchFilter: DeepPartial<SearchFilterInterface>,
    searchCriteria: string[],
    relations: string[] = []
  ): Promise<T[]> {
    const whereConditions: any[] = [];

    if (searchFilter.keyword) {
      searchCriteria.forEach((field) => {
        whereConditions.push({
          [field]: ILike(`%${searchFilter.keyword}%`),
        });
      });
    }

    // Add status filter if provided
    if (searchFilter.status) {
      const statuses = Array.isArray(searchFilter.status)
        ? searchFilter.status
        : [searchFilter.status];
      whereConditions.push({ status: In(statuses) });
    }

    // Add date range filter if provided
    if (searchFilter.startDate || searchFilter.endDate) {
      const dateCondition: any = {};
      if (searchFilter.startDate) {
        dateCondition.createdAt = { ...dateCondition.createdAt, $gte: searchFilter.startDate };
      }
      if (searchFilter.endDate) {
        dateCondition.createdAt = { ...dateCondition.createdAt, $lte: searchFilter.endDate };
      }
      whereConditions.push(dateCondition);
    }

    const findOptions: FindManyOptions<T> = {
      where: whereConditions.length > 0 ? this.buildWhereClause(whereConditions) : undefined,
      relations,
      order: this.buildOrder(searchFilter) as any,
    };

    return this.find(findOptions);
  }

  /**
   * Paginate entities with filters
   * @param searchFilter Search and pagination filters
   * @param searchCriteria Fields to search in
   * @param relations Relations to load
   */
  async paginate(
    searchFilter: DeepPartial<SearchFilterInterface>,
    searchCriteria: string[] = [],
    relations: string[] = []
  ): Promise<PaginatedResult<T>> {
    const page = Math.max(1, searchFilter.page || 1);
    const limit = Math.min(100, Math.max(1, searchFilter.limit || 20));
    const skip = (page - 1) * limit;

    const whereConditions: any[] = [];

    if (searchFilter.keyword) {
      searchCriteria.forEach((field) => {
        whereConditions.push({
          [field]: ILike(`%${searchFilter.keyword}%`),
        });
      });
    }

    // Add status filter if provided
    if (searchFilter.status) {
      const statuses = Array.isArray(searchFilter.status)
        ? searchFilter.status
        : [searchFilter.status];
      whereConditions.push({ status: In(statuses) });
    }

    const [items, totalItems] = await this.findAndCount({
      where: whereConditions.length > 0 ? this.buildWhereClause(whereConditions) : undefined,
      relations,
      skip,
      take: limit,
      order: this.buildOrder(searchFilter) as any,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Create new entity
   * @param createDto Create data
   * @param relations Relations to load after creating
   */
  async createEntity(createDto: DeepPartial<T>, relations: string[] = []): Promise<T> {
    const entity = this.create(createDto);
    const savedEntity = await this.save(entity);
    return this.getById((savedEntity as any).id, relations);
  }

  /**
   * Update existing entity
   * @param id Entity UUID
   * @param updateDto Update data
   * @param relations Relations to load after updating
   */
  async updateEntity(id: string, updateDto: QueryDeepPartialEntity<T>, relations: string[] = []): Promise<T> {
    await this.update(id, updateDto);
    return this.getById(id, relations);
  }

  /**
   * Soft delete entity
   * @param id Entity UUID
   */
  async softRemoveEntity(id: string): Promise<void> {
    const entity = await this.getById(id);
    await this.softRemove(entity);
  }

  /**
   * Hard delete entity
   * @param id Entity UUID
   */
  async hardRemoveEntity(id: string): Promise<void> {
    const entity = await this.getById(id);
    await this.remove(entity);
  }

  /**
   * Get pagination metadata
   * @param page Current page
   * @param limit Items per page
   * @param total Total items
   */
  getPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    return {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  /**
   * Build order clause from search filter
   * @param searchFilter Search filter with orderBy and sortOrder
   */
  private buildOrder(searchFilter: any): Record<string, 'ASC' | 'DESC'> {
    const sortBy = searchFilter.sortBy || 'createdAt';
    const sortOrder = (searchFilter.sortOrder || 'DESC').toUpperCase();

    return {
      [sortBy]: sortOrder,
    };
  }

  /**
   * Build where clause from array of conditions
   * @param conditions Array of conditions
   */
  private buildWhereClause(conditions: any[]): any {
    if (conditions.length === 0) {
      return undefined;
    }

    if (conditions.length === 1) {
      return conditions[0];
    }

    // For multiple conditions, create OR logic for keyword searches
    // and AND logic for filters
    return conditions;
  }
}

interface SearchFilterInterface {
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
  status?: string | string[];
}