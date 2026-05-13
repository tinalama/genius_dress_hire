import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpStatus, Injectable } from '@nestjs/common';
import { getConfig, JwtConfig } from '@app/config';
import { UnauthorizedException } from '@app/common-module';

import { JwtPayloadDto } from '../../auth/dto/jwt-payload.dto';
import { AuthService } from '../../auth/auth.service';
import { UserSerializer } from '../../auth/serializer/user.serializer';
import { DepartmentRoleRepository } from '../../role/department-role.repository';
import { Request } from 'express';

const cookieExtractor = (req) => {
  return req?.cookies?.Authentication;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-strategy') {
  constructor(
    private readonly service: AuthService,
    private readonly departmentRoleRepository: DepartmentRoleRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWT_SECRET || getConfig<JwtConfig>('jwt').secret,
      passReqToCallback: true
    });
  }

  /**
   * Validate if user exists and return user entity
   * @param payload
   */
  async validate(
    request: Request,
    payload: JwtPayloadDto
  ): Promise<UserSerializer> {
    const { subject, departmentRoleId } = payload;
    const user = await this.service.findOne(Number(subject), [
      // 'role',
      // 'role.permission'
    ]);
    if (!user) {
      throw new UnauthorizedException();
    }
    const departmentRole =
      await this.departmentRoleRepository.getDepartmentRoles(
        departmentRoleId,
        user.id
      );
    if (!departmentRole) {
      const refreshToken = request.cookies['Refresh'];
      await this.service.revokeRefreshToken(refreshToken);
      throw new UnauthorizedException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return {
      ...user,
      role: departmentRole.role
    };
  }
}
