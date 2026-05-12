import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../common/exceptions/resource-not-found.exception';
import type { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import type { CreateUserDto } from '../dto/request/create-user.dto';
import type { ListUsersQueryDto } from '../dto/request/list-users-query.dto';
import type { UpdateUserDto } from '../dto/request/update-user.dto';
import type { UserResponseDto } from '../dto/response/user-response.dto';
import type { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserSerializer } from '../serializers/user.serializer';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSerializer: UserSerializer,
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.userRepository.create({
      ...dto,
      passwordHash,
    });
    return this.userSerializer.toResponse(user);
  }

  async findAllPaginated(
    query: ListUsersQueryDto,
  ): Promise<PaginatedResult<UserResponseDto>> {
    const result = await this.userRepository.findAllPaginated(query);
    return {
      items: this.userSerializer.toResponseList(result.items),
      meta: result.meta,
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.getUserOrThrow(id);
    return this.userSerializer.toResponse(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    await this.getUserOrThrow(id);
    if (dto.email) {
      const other = await this.userRepository.findByEmail(dto.email);
      if (other && other.id !== id) {
        throw new ConflictException('Email is already in use');
      }
    }
    const patch: Partial<User> = {};
    if (dto.email !== undefined) {
      patch.email = dto.email.trim().toLowerCase();
    }
    if (dto.firstName !== undefined) {
      patch.firstName = dto.firstName;
    }
    if (dto.lastName !== undefined) {
      patch.lastName = dto.lastName;
    }
    if (dto.password !== undefined) {
      patch.passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    }
    const user = await this.userRepository.update(id, patch);
    return this.userSerializer.toResponse(user);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.getUserOrThrow(id);
    await this.userRepository.softDelete(id);
    return { deleted: true };
  }

  private async getUserOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ResourceNotFoundException('User', id);
    }
    return user;
  }
}
