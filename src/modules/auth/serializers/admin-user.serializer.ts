import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ModelSerializer } from '../../../common-module/serializer/model.serializer';
import { AdminUserStatusEnum } from '../enums/admin-user-status.enum';

export const adminUserGroupsForSerializing: string[] = ['admin'];

export class AdminUserSerializer extends ModelSerializer {
  @Expose()
  @ApiPropertyOptional({ example: 'Tina', nullable: true })
  firstName!: string | null;

  @Expose()
  @ApiPropertyOptional({ example: 'Sharma', nullable: true })
  lastName!: string | null;

  @Expose()
  @ApiProperty({ example: 'admin@example.com' })
  email!: string;

  @Expose()
  @ApiPropertyOptional({ example: '+977-9800000000', nullable: true })
  phoneNumber!: string | null;

  @Expose()
  @ApiProperty({ type: String, enum: AdminUserStatusEnum, default: AdminUserStatusEnum.INACTIVE })
  status!: AdminUserStatusEnum;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;

  @Exclude()
  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  lastLoginAt!: Date | null;

  @Exclude()
  password?: string;

  @Exclude()
  salt?: string;

  @Exclude()
  token?: string;

  @Exclude()
  tokenExpiry?: Date | null;

  @Exclude()
  tokenValidityDate?: Date | null;

  @Exclude()
  deletedAt?: Date | null;

  @Exclude()
  skipHashPassword?: boolean;
}
