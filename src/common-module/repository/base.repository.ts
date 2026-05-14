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
  T extends ObjectLiteral,
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
        return this.transform(entity, transformOptions);
      })
      .catch((error) => Promise.reject(error));
  }

  /**
   * find all with pagination
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
    const { page, limit, skip, keyword } = this.getPaginationInfo(searchFilter);
    const order = await this.getOrder(searchFilter.sort);

    const whereCondition: any[] = [];
    if (searchFilter.hasOwnProperty('keyword') && searchFilter.keyword) {
      for (const key of searchCriteria) {
        whereCondition.push({
          [key]: ILike(`%${searchFilter.keyword}%`)
        });
      }
    }
    const [results, total] = await this.findAndCount({
      skip,
      take: limit,
      where: whereCondition.length > 0 ? whereCondition : undefined,
      relations,
      order: order as any
    });

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
   * find all with search filter
   * @param searchFilter
   * @param relations
   * @param searchCriteria
   * @param transformOptions
   */
  async search(
    searchFilter: DeepPartial<SearchFilterInterface>,
    relations: string[] = [],
    searchCriteria: string[] = [],
    transformOptions = {}
  ): Promise<K[]> {
    const whereCondition: any[] = [];
    if (searchFilter.hasOwnProperty('keyword') && searchFilter.keyword) {
      for (const key of searchCriteria) {
        whereCondition.push({
          [key]: ILike(`%${searchFilter.keyword}%`)
        });
      }
    }
    const results = await this.find({
      where: whereCondition.length > 0 ? whereCondition : undefined,
      relations
    });
    return this.transformMany(results, transformOptions);
  }

  /**
   * Get pagination Skip & limit
   * @param options
   */
  getPaginationInfo(options: any): PaginationInfoInterface {
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

  async getOrder(sort?: string): Promise<Record<string, 'DESC' | 'ASC'>> {
    if (!sort) {
      return {};
    }
    const columns = Array.isArray(sort) ? sort : sort.split(',');
    const order: Record<string, 'DESC' | 'ASC'> = {};

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
   * create new entity
   * @param inputs
   * @param relations
   */
  async createEntity(
    inputs: DeepPartial<T>,
    relations: string[] = []
  ): Promise<K> {
    const entity = await this.save(inputs);
    if (!entity) {
      throw new CustomHttpException(
        'Failed to create entity',
        HttpStatus.INTERNAL_SERVER_ERROR,
        StatusCodesList.InternalServerError
      );
    }
    const result = await this.get((entity as any).id, relations);
    if (!result) {
      throw new CustomHttpException(
        'Failed to retrieve created entity',
        HttpStatus.INTERNAL_SERVER_ERROR,
        StatusCodesList.InternalServerError
      );
    }
    return result;
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
    await this.update(entity.id, inputs);
    const result = await this.get(entity.id, relations, transformOptions);
    if (!result) {
      throw new CustomHttpException(
        'Failed to retrieve updated entity',
        HttpStatus.INTERNAL_SERVER_ERROR,
        StatusCodesList.InternalServerError
      );
    }
    return result;
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
