import { Body, Controller, HttpCode, HttpStatus, Param, Post, Put, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { MessageEnum } from '../../common-module/custom-constant/message.constant';
import { GetUser } from '../../common-module/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common-module/guard/jwt-auth.guard';
import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginDto } from './dto/login.dto';
import { AdminUserSerializer } from './serializers/admin-user.serializer';
import { AdminUser } from './entities/admin-user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new admin user.',
    description: 'Creates an admin user record with a bcrypt-hashed password. Emails must be unique.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin user was created successfully.',
    type: AdminUserSerializer,
  })
  async registerAdminUser(@Body() dto: RegisterAdminDto) {
    try {
      const data = await this.authService.registerAdminUser(dto);
      return {
        message: MessageEnum.MODULE_CREATED_SUCCESSFULLY('Admin user'),
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log in an admin user.',
    description: 'Authenticates an admin user and sets their status to active.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin user logged in successfully.',
    type: AdminUserSerializer,
  })
  async login(@Body() dto: LoginDto) {
    try {
      const data = await this.authService.login(dto.email, dto.password);
      return {
        message: MessageEnum.DATA_FETCHED_SUCCESSFULLY,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update admin user details.',
    description: 'Updates admin user information (firstName, lastName, email, phoneNumber). Users can only update their own profile. Password cannot be updated through this endpoint.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin user updated successfully.',
    type: AdminUserSerializer,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User can only update their own profile.',
  })
  async updateAdminUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminDto,
    @GetUser() currentUser: AdminUser
  ) {
    try {
      const data = await this.authService.updateAdminUser(id, dto, currentUser);
      return {
        message: MessageEnum.MODULE_UPDATED_SUCCESSFULLY('Admin user'),
        data
      };
    } catch (error) {
      throw error;
    }
  }
}
