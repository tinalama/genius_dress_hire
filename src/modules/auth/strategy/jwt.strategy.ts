import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { AdminUser } from '../entities/admin-user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-strategy') {
  constructor(
    private readonly authService: AuthService,
    config: ConfigService,
  ) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    } satisfies StrategyOptions);
  }

  async validate(payload: JwtPayloadDto): Promise<AdminUser> {
    const { subject } = payload;
    if (!subject) {
      throw new UnauthorizedException('Invalid token payload.');
    }

    try {
      return await this.authService.findOne(Number(subject));
    } catch {
      throw new UnauthorizedException('User no longer exists or is disabled.');
    }
  }
}
