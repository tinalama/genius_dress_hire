import { Injectable } from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';
import { BaseRepository } from '../../../common-module/repository/base.repository';
import { Pagination } from '../../../common-module/paginate/pagination';
import { AdminUser } from '../entities/admin-user.entity';
import {
  adminUserGroupsForSerializing,
  AdminUserSerializer,
} from '../serializers/admin-user.serializer';
import { AdminUserStatusEnum } from '../enums/admin-user-status.enum';
import { ListAdminsQueryDto } from '../dto/list-admins-query.dto';

const adminUserTransformOptions = {
  excludeExtraneousValues: true,
  groups: adminUserGroupsForSerializing,
} as const;

@Injectable()
export class AdminUserRepository extends BaseRepository<AdminUser, AdminUserSerializer> {
  constructor(private dataSource: DataSource) {
    super(AdminUser, dataSource.createEntityManager());
  }

  transform(
    model: AdminUser,
    transformOptions: Record<string, unknown> = {},
  ): AdminUserSerializer {
    return this.customTransform(model, AdminUserSerializer, {
      ...adminUserTransformOptions,
      ...transformOptions,
    });
  }

  transformMany(
    models: AdminUser[],
    transformOptions: Record<string, unknown> = {},
  ): AdminUserSerializer[] {
    return this.customTransformMany(models, AdminUserSerializer, {
      ...adminUserTransformOptions,
      ...transformOptions,
    });
  }

  async listAdmins(query: ListAdminsQueryDto): Promise<Pagination<AdminUserSerializer>> {
    const searchFilter = { ...query, sort: query.sort ?? '-createdAt' };
    const { page, limit, skip, keyword } = this.getPaginationInfo(searchFilter);
    const order = await this.getOrder(searchFilter.sort);
    const searchCriteria = ['email', 'firstName', 'lastName', 'phoneNumber'];

    const whereCondition: Record<string, ReturnType<typeof ILike>>[] = [];
    if (keyword) {
      for (const key of searchCriteria) {
        whereCondition.push({ [key]: ILike(`%${keyword}%`) });
      }
    }

    const [results, total] = await this.findAndCount({
      skip,
      take: limit,
      where: whereCondition.length > 0 ? whereCondition : undefined,
      order: order as Record<string, 'ASC' | 'DESC'>,
    });

    return new Pagination<AdminUserSerializer>({
      results: this.transformMany(results),
      paginationInfo: {
        current_page: page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
        prevPage: page > 1 ? page - 1 : 0,
        nextPage: total > skip + limit ? page + 1 : 0,
      },
    });
  }

  async findByUuid(uuid: string): Promise<AdminUserSerializer | null> {
    const result = await this.findOne({
      where: { _id: uuid },
    });

    if (!result) {
      return null;
    }

    return this.transform(result);
  }

  async findByEmailWithInactive(
    email: string,
    transformOptions = {}
  ): Promise<AdminUserSerializer | null> {
    const result = await this.findOne({
      where: { email },
      withDeleted: true,
    });

    if (!result) {
      return null;
    }

    return this.transform(result as AdminUser, transformOptions);
  }

  async findByEmail(
    email: string,
    transformOptions = {}
  ): Promise<AdminUserSerializer | null> {
    const result = await this.findOne({
      where: { email, status: AdminUserStatusEnum.ACTIVE },
    });

    if (!result) {
      return null;
    }

    return this.transform(result as AdminUser, transformOptions);
  }
}
