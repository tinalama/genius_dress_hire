import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common-module/repository/base.repository';
import { AdminUser } from '../entities/admin-user.entity';
import { AdminUserSerializer } from '../serializers/admin-user.serializer';
import { AdminUserStatusEnum } from '../enums/admin-user-status.enum';

@Injectable()
export class AdminUserRepository extends BaseRepository<AdminUser, AdminUserSerializer> {
  constructor(private dataSource: DataSource) {
    super(AdminUser, dataSource.createEntityManager());
  }

  transform(model: AdminUser, transformOptions = {}): AdminUserSerializer {
    return this.customTransform(model, AdminUserSerializer, transformOptions);
  }

  transformMany(models: AdminUser[], transformOptions = {}): AdminUserSerializer[] {
    return this.customTransformMany(models, AdminUserSerializer, transformOptions);
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
