import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { RegisterAdminDto } from './dto/register-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminUser } from './entities/admin-user.entity';
import { AdminUserRepository } from './repositories/admin-user.repository';
import { adminUserGroupsForSerializing } from './serializers/admin-user.serializer';
import { AdminUserSerializer } from './serializers/admin-user.serializer';
import { AdminUserStatusEnum } from './enums/admin-user-status.enum';
import { CustomHttpException } from '../../common-module/exception/custom-http.exception';
import { StatusCodesList } from '../../common-module/custom-constant/status-codes-list.constant';

@Injectable()
export class AuthService {
  constructor(private readonly adminUserRepository: AdminUserRepository) { }

  async registerAdminUser(dto: RegisterAdminDto) {
    const existing = await this.adminUserRepository.findByEmailWithInactive(
      dto.email,
    );

    if (existing) {
      throw new ConflictException('An admin with this email already exists.');
    }

    const user = this.adminUserRepository.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName ?? null,
      lastName: dto.lastName ?? null,
      phoneNumber: dto.phoneNumber ?? null,
      status: AdminUserStatusEnum.INACTIVE,
    });

    await this.adminUserRepository.save(user);

    const serializedUser = await this.adminUserRepository.findByEmailWithInactive(dto.email, {
      groups: adminUserGroupsForSerializing,
    });

    if (!serializedUser) {
      throw new NotFoundException('Admin user registration failed.');
    }

    return serializedUser;
  }

  async findOne(id: number, relations: string[] = []): Promise<AdminUser> {
    const user = await this.adminUserRepository.findOne({
      where: { id, status: AdminUserStatusEnum.ACTIVE },
      relations,
    });

    if (!user) {
      throw new NotFoundException(`Admin user ${id} not found.`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<AdminUser | null> {
    const result = await this.adminUserRepository.findByEmail(email);
    return result as any;
  }

  async login(email: string, password: string): Promise<AdminUserSerializer> {
    const user = await this.adminUserRepository.findByEmailWithInactive(email);

    if (!user) {
      throw new CustomHttpException(
        'Invalid email or password',
        401,
        StatusCodesList.UnauthorizedAccess
      );
    }

    const entity = await this.adminUserRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'salt', 'status', 'lastLoginAt'],
    });

    if (!entity) {
      throw new NotFoundException('Admin user entity not found.');
    }

    // Validate password
    const isPasswordValid = await entity.validatePassword(password);
    if (!isPasswordValid) {
      throw new CustomHttpException(
        'Invalid email or password',
        401,
        StatusCodesList.UnauthorizedAccess
      );
    }

    // Update status to active
    if (entity.status !== AdminUserStatusEnum.ACTIVE) {
      entity.status = AdminUserStatusEnum.ACTIVE;
      entity.lastLoginAt = new Date();
      await this.adminUserRepository.save(entity);
    } else {
      // Just update last login time
      entity.lastLoginAt = new Date();
      await this.adminUserRepository.save(entity);
    }

    const serializedUser = await this.adminUserRepository.findByEmail(email, {
      groups: adminUserGroupsForSerializing,
    });

    if (!serializedUser) {
      throw new NotFoundException('Failed to retrieve admin user after login.');
    }

    return serializedUser;
  }

  async updateAdminUser(id: number, dto: UpdateAdminDto, currentUser: AdminUser): Promise<AdminUserSerializer> {
    // Check if the current user is trying to update their own profile
    if (currentUser.id !== id) {
      throw new ForbiddenException('You can only update your own profile.');
    }

    const user = await this.findOne(id);

    // Check if email is being updated and if it's already taken
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.adminUserRepository.findByEmailWithInactive(dto.email);
      if (existingUser) {
        throw new ConflictException('Email is already in use by another admin user.');
      }
    }

    // Update only provided fields
    const updateData: Partial<AdminUser> = {};
    if (dto.firstName !== undefined) updateData.firstName = dto.firstName;
    if (dto.lastName !== undefined) updateData.lastName = dto.lastName;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.phoneNumber !== undefined) updateData.phoneNumber = dto.phoneNumber;

    // Update the user
    await this.adminUserRepository.update(id, updateData);

    // Fetch and return the updated user
    const updatedUser = await this.findOne(id);
    return this.adminUserRepository.transform(updatedUser, {
      groups: adminUserGroupsForSerializing,
    });
  }
}
