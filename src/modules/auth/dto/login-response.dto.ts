import { ApiProperty } from '@nestjs/swagger';

import { AdminUserSerializer } from '../serializers/admin-user.serializer';

/**
 * Login response shape (user fields + JWT).
 */
export class LoginResponseDto extends AdminUserSerializer {
  @ApiProperty({
    description:
      'JWT from login. In Swagger: click **Authorize** (top right), paste this value only (no "Bearer " prefix), or use the Authorization header on PUT /auth/profile.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;
}
