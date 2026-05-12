import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../dto/response/user-response.dto';
import type { User } from '../entities/user.entity';
import { BaseSerializer } from '../../../common/serializers/base.serializer';

@Injectable()
export class UserSerializer extends BaseSerializer {
  toResponse(user: User): UserResponseDto {
    return this.plainToDto(UserResponseDto, user, true);
  }

  toResponseList(users: User[]): UserResponseDto[] {
    return this.plainListToDto(UserResponseDto, users, true);
  }
}
