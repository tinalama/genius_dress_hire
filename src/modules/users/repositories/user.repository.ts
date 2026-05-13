import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceNotFoundException } from '../../../common/exceptions/resource-not-found.exception';
import { PaginationUtil } from '../../../common/utils/pagination.util';
import type { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import type { CreateUserDto } from '../dto/request/create-user.dto';
import type { ListUsersQueryDto } from '../dto/request/list-users-query.dto';
import { User } from '../entities/user.entity';
import type { IUserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(data: CreateUserDto & { passwordHash: string }): Promise<User> {
    const entity = this.repo.create({
      email: data.email.trim().toLowerCase(),
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string, withPassword = false): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    if (withPassword) {
      return this.repo.findOne({
        where: { email: normalized },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
    }
    return this.repo.findOne({ where: { email: normalized } });
  }

  async findAllPaginated(
    query: ListUsersQueryDto,
  ): Promise<PaginatedResult<User>> {
    const { page, limit, sortOrder, search } = query;
    const qb = this.repo.createQueryBuilder('user');

    if (search?.trim()) {
      const term = `%${search.trim()}%`;
      qb.andWhere(
        '(user.email ILIKE :term OR user.firstName ILIKE :term OR user.lastName ILIKE :term)',
        { term },
      );
    }

    qb.orderBy('user.createdAt', sortOrder);
    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [items, total] = await qb.getManyAndCount();
    return PaginationUtil.createPaginatedResult(items, total, page, limit);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new ResourceNotFoundException('User', id);
    }
    Object.assign(user, data);
    return this.repo.save(user);
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.repo.softDelete(id);
    if (!result.affected) {
      throw new ResourceNotFoundException('User', id);
    }
  }
}
