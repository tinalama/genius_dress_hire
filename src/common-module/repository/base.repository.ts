import { plainToInstance } from 'class-transformer';
import {
  DeepPartial,
  FindManyOptions,
  ILike,
  ObjectLiteral,
  Repository
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { NotFoundException } from '../exception/not-found.exception';
import { Pagination } from '../paginate/pagination';
import { PaginationInfoInterface } from '../paginate/pagination-info.interface';
import { SearchFilterInterface } from '../interfaces/search-filter.interface';
import { ModelSerializer } from '../serializer/model.serializer';
import { CustomHttpException } from '../exception/custom-http.exception';
import { HttpStatus } from '@nestjs/common';
import { StatusCodesList } from '../custom-constant/status-codes-list.constant';
/**
 * Base Repository for code reuse
 */
export class BaseRepository<
  T,
  K extends ModelSerializer
> extends Repository<T> {
  /***
   * get entity by id
   * @param id
   * @param relations
   * @param transformOptions
   */
  async get(
    id: number,
    relations: string[] = [],
    transformOptions = {}
  ): Promise<K | null> {
    return await this.findOne({
      where: {
        id
      },
      relations
    } as any)
      .then((entity) => {
        if (!entity) {
          return Promise.reject(
            new CustomHttpException(
              'Not found.',
              HttpStatus.NOT_FOUND,
              StatusCodesList.NotFound
            )
          );
        }
        return Promise.resolve(
          entity ? this.transform(entity, transformOptions) : null
        );
      })
      .catch((error) => Promise.reject(error));
  }

  /**
   * find by condition
   * @param fieldName
   * @param value
   * @param relations
   * @param transformOptions
   */
  async findByCondition(
    fieldName: string,
    value: any,
    relations: string[] = [],
    transformOptions = {}
  ): Promise<K | null> {
    return await this.findOne({
      where: {
        [fieldName]: value
      },
      relations
    } as any)
      .then((entity) => {
        if (!entity) {
          return Promise.reject(new NotFoundException());
        }
        return Promise.resolve(
          entity ? this.transform(entity, transformOptions) : null
        );
      })
      .catch((error) => Promise.reject(error));
  }

  /**
   * get count of entity by condition
   * @param conditions
   */
  async countEntityByCondition(
    conditions: ObjectLiteral = {}
  ): Promise<number> {
    return this.count({
      where: conditions
    } as any)
      .then((count) => {
        return Promise.resolve(count);
      })
      .catch((error) => Promise.reject(error));
  }

  /**
   * get all entity with filters
   * @param searchFilter
   * @param relations
   * @param searchCriteria
   * @param transformOptions
   */
  async findAll(
    searchFilter: DeepPartial<SearchFilterInterface>,
    relations: string[] = [],
    searchCriteria: string[],
    transformOptions = {}
  ): Promise<K[]> {
    const whereCondition = [];
    if (searchFilter.hasOwnProperty('keyword') && searchFilter.keyword) {
      for (const key of searchCriteria) {
        whereCondition.push({
          [key]: ILike(`%${searchFilter.keyword}%`)
        });
      }
    }
    const results = await this.find({
      where: whereCondition,
      relations
    });
    return this.transformMany(results, transformOptions);
  }

  /**
   * Get pagination Skip & limit
   * @param options
   */
  getPaginationInfo(options): PaginationInfoInterface {
    const page =
      typeof options.page !== 'undefined' && options.page > 0
        ? options.page
        : 1;
    const limit =
      typeof options.limit !== 'undefined' && options.limit > 0
        ? options.limit
        : 20;
    return {
      skip: (page - 1) * limit,
      limit,
      page,
      keyword: options.keyword
    };
  }

  async getOrder(sort: string): Promise<Record<string, 'DESC' | 'ASC'> | null> {
    if (!sort) {
      return {};
    }
    const columns = Array.isArray(sort) ? sort : sort.split(',');
    const order = {};

    for (const column of columns) {
      const key = column.startsWith('-')
        ? column.substring(1).trim()
        : column.trim();
      const direction = column.startsWith('-') ? 'DESC' : 'ASC';
      order[key] = direction;
    }

    return order;
  }

  /**
   * Paginate data
   * @param searchFilter
   * @param relations
   * @param searchCriteria
   * @param transformOptions
   */
  async paginate(
    searchFilter: DeepPartial<SearchFilterInterface>,
    relations: string[] = [],
    searchCriteria: string[] = [],
    transformOptions = {}
  ): Promise<Pagination<K>> {
    const whereCondition = [];
    const findOptions: FindManyOptions = {};
    if (searchFilter.hasOwnProperty('keyword') && searchFilter.keyword) {
      for (const key of searchCriteria) {
        whereCondition.push({
          [key]: ILike(`%${searchFilter.keyword}%`)
        });
      }
    }
    const paginationInfo: PaginationInfoInterface =
      this.getPaginationInfo(searchFilter);
    findOptions.relations = relations;
    findOptions.skip = paginationInfo.skip;
    findOptions.take = paginationInfo.limit;
    if (whereCondition.length > 0) findOptions.where = whereCondition;
    findOptions.order = {
      createdAt: 'DESC'
    };
    const { page, skip, limit } = paginationInfo;
    const [results, total] = await this.findAndCount(findOptions);
    const serializedResult = this.transformMany(results, transformOptions);
    return new Pagination<K>({
      results: serializedResult,
      paginationInfo: {
        current_page: page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
        prevPage: page > 1 ? page - 1 : 0,
        nextPage: total > skip + limit ? page + 1 : 0
      }
    });
  }

  /**
   * create new entity
   * @param inputs
   * @param relations
   */
  async createEntity(
    inputs: DeepPartial<T>,
    relations: string[] = []
  ): Promise<K> {
    return this.save(inputs)
      .then(async (entity) => await this.get((entity as any).id, relations))
      .catch((error) => Promise.reject(error));
  }

  /**
   * update existing entity by id
   * @param entity
   * @param inputs
   * @param relations
   */
  async updateEntity(
    entity: K,
    inputs: QueryDeepPartialEntity<T>,
    relations: string[] = [],
    transformOptions = {}
  ): Promise<K> {
    return this.update(entity.id, inputs)
      .then(async () => await this.get(entity.id, relations, transformOptions))
      .catch((error) => Promise.reject(error));
  }

  /**
   * transform entity
   * @param model
   * @param transformOptions
   */
  transform(model: T, transformOptions = {}): K {
    return plainToInstance(ModelSerializer, model, transformOptions) as K;
  }

  /**
   * transform array of entity
   * @param models
   * @param transformOptions
   */
  transformMany(models: T[], transformOptions = {}): K[] {
    return models.map((model) => this.transform(model, transformOptions));
  }

  customTransform(model: any, serializer: any, transformOption = {}): any {
    return plainToInstance(serializer, model, transformOption);
  }

  customTransformMany(
    models: any[],
    serializer: any,
    transformOption = {}
  ): any[] {
    return models.map((model) =>
      this.customTransform(model, serializer, transformOption)
    );
  }
}
