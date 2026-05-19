import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ForbiddenException } from '../../common-module/exception/forbidden.exception';
import { JwtService } from '@nestjs/jwt';

import { RegisterAdminDto } from './dto/register-admin.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ListAdminsQueryDto } from './dto/list-admins-query.dto';
import { UpdateAdminStatusDto } from './dto/update-admin-status.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Pagination } from '../../common-module/paginate/pagination';
import { AdminUser } from './entities/admin-user.entity';
import { AdminUserRepository } from './repositories/admin-user.repository';
import { adminUserGroupsForSerializing } from './serializers/admin-user.serializer';
import { AdminUserSerializer } from './serializers/admin-user.serializer';
import { AdminUserStatusEnum } from './enums/admin-user-status.enum';
import { CustomHttpException } from '../../common-module/exception/custom-http.exception';
import { StatusCodesList } from '../../common-module/custom-constant/status-codes-list.constant';

export interface AdminLoginResult {
  user: AdminUserSerializer;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  private assertOwnAdminAccount(
    currentUser: AdminUser,
    targetUuid: string,
  ): void {
    if (currentUser._id !== targetUuid) {
      throw new ForbiddenException('You can only update your own admin account.');
    }
  }

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
      status: AdminUserStatusEnum.ACTIVE,
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

  async login(email: string, password: string): Promise<AdminLoginResult> {
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

    const isPasswordValid = await entity.validatePassword(password);
    if (!isPasswordValid) {
      throw new CustomHttpException(
        'Invalid email or password',
        401,
        StatusCodesList.UnauthorizedAccess
      );
    }

    if (entity.status !== AdminUserStatusEnum.ACTIVE) {
      throw new ForbiddenException(
        'Your account is inactive. Contact an administrator to reactivate your account.',
      );
    }

    entity.lastLoginAt = new Date();
    await this.adminUserRepository.save(entity);

    const serializedUser = await this.adminUserRepository.findByEmail(email, {
      groups: adminUserGroupsForSerializing,
    });

    if (!serializedUser) {
      throw new NotFoundException('Failed to retrieve admin user after login.');
    }

    const payload: JwtPayloadDto = {
      subject: entity.id,
      uuid: serializedUser._id,
      email: serializedUser.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { user: serializedUser, accessToken };
  }

  async updateAdminUser(
    currentUser: AdminUser,
    dto: UpdateAdminDto,
  ): Promise<AdminUserSerializer> {
    const id = currentUser.id;
    if (!id) {
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

  async listAdmins(
    query: ListAdminsQueryDto,
  ): Promise<Pagination<AdminUserSerializer>> {
    return this.adminUserRepository.listAdmins(query);
  }

  async getAdminByUuid(uuid: string): Promise<AdminUserSerializer> {
    const admin = await this.adminUserRepository.findByUuid(uuid);

    if (!admin) {
      throw new NotFoundException(`Admin user ${uuid} not found.`);
    }

    return admin;
  }

  async updateAdminStatus(
    uuid: string,
    dto: UpdateAdminStatusDto,
  ): Promise<AdminUserSerializer> {
    const entity = await this.adminUserRepository.findOne({
      where: { _id: uuid },
    });

    if (!entity) {
      throw new NotFoundException(`Admin user ${uuid} not found.`);
    }

    entity.status = dto.status
      ? AdminUserStatusEnum.ACTIVE
      : AdminUserStatusEnum.INACTIVE;

    await this.adminUserRepository.save(entity);

    return this.adminUserRepository.transform(entity);
  }

  async changePassword(
    currentUser: AdminUser,
    dto: ChangePasswordDto,
  ): Promise<AdminUserSerializer> {
    if (!currentUser.id) {
      throw new ForbiddenException('You can only change your own password.');
    }

    const entity = await this.adminUserRepository.findOne({
      where: { id: currentUser.id, status: AdminUserStatusEnum.ACTIVE },
      select: ['id', 'email', 'password', 'salt', 'status'],
    });

    if (!entity) {
      throw new NotFoundException(`Admin user ${currentUser.id} not found.`);
    }

    const isCurrentPasswordValid = await entity.validatePassword(
      dto.currentPassword,
    );
    if (!isCurrentPasswordValid) {
      throw new CustomHttpException(
        'Current password is incorrect.',
        400,
        StatusCodesList.BadRequest,
      );
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must be different from the current password.',
      );
    }

    entity.password = dto.newPassword;
    entity.salt = null;
    await entity.hashPassword();
    await this.adminUserRepository.save(entity);

    const updatedUser = await this.findOne(currentUser.id);
    return this.adminUserRepository.transform(updatedUser, {
      groups: adminUserGroupsForSerializing,
    });
  }
}
