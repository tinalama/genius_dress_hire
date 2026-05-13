import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getConfig, JwtConfig } from '@app/config';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  StatusCodesList,
  CustomHttpException,
  UnauthorizedException
} from '@app/common-module';
import { RequestContext, RequestUserContext } from '@app/request-context';

import { JwtPayloadDto } from '../../auth/dto/jwt-payload.dto';
import { AuthService } from '../../auth/auth.service';
import { UserSerializer } from '../../auth/serializer/user.serializer';
import { DepartmentRoleRepository } from '../../role/department-role.repository';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor'
) {
  constructor(
    private readonly service: AuthService,
    private readonly departmentRoleRepository: DepartmentRoleRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.Authentication;
        }
      ]),
      secretOrKey: process.env.JWT_SECRET || getConfig<JwtConfig>('jwt').secret,
      passReqToCallback: true
    });
  }

  async validate(
    request: Request,
    payload: JwtPayloadDto
  ): Promise<UserSerializer> {
    const { isTwoFAAuthenticated, subject, departmentRoleId } = payload;
    const user = await this.service.findOne(Number(subject), [
      'employees_info',
      'employees_info.company',
      'employees_info.department'
      // 'role',
      // 'role.permission'
    ]);
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
    const ctx: RequestUserContext = RequestContext.get();
    ctx.user = {
      id: user.id
    };
    if (!user.isTwoFAEnabled) {
      return {
        ...user,
        role: departmentRole.role,
        department_role: [departmentRole]
      };
    }
    if (isTwoFAAuthenticated) {
      return {
        ...user,
        role: departmentRole.role,
        department_role: [departmentRole]
      };
    }

    throw new CustomHttpException(
      'otpRequired',
      HttpStatus.FORBIDDEN,
      StatusCodesList.OtpRequired
    );
  }
}
