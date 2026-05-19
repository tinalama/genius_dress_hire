import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

import { StatusCodesList } from '../custom-constant/status-codes-list.constant';
import { UnauthorizedException } from '../exception/unauthorized.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-strategy') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException(
        'tokenExpired',
        StatusCodesList.TokenExpired
      );
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
