import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { UsersService } from '../../users/services/users.service';
import { UserRepository } from '../../users/repositories/user.repository';
import { UserSerializer } from '../../users/serializers/user.serializer';
import type { UserResponseDto } from '../../users/dto/response/user-response.dto';
import type { LoginDto } from '../dto/login.dto';
import type { RegisterDto } from '../dto/register.dto';
import type { User } from '../../users/entities/user.entity';

export interface AuthTokensPayload {
  accessToken: string;
  user: UserResponseDto;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly userSerializer: UserSerializer,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokensPayload> {
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user };
  }

  async login(dto: LoginDto): Promise<AuthTokensPayload> {
    const user = await this.userRepository.findByEmail(dto.email, true);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.buildTokenResponse(user);
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    return this.usersService.findOne(userId);
  }

  private buildTokenResponse(user: User): AuthTokensPayload {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: this.userSerializer.toResponse(user),
    };
  }
}
