import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ListResponseDto } from '../../common-module/dto/list-response.dto';

import { MessageEnum } from '../../common-module/custom-constant/message.constant';
import { GetUser } from '../../common-module/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common-module/guard/jwt-auth.guard';
import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateAdminStatusDto } from './dto/update-admin-status.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminUuidParamDto } from './dto/admin-uuid-param.dto';
import { ListAdminsQueryDto } from './dto/list-admins-query.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AdminUserSerializer } from './serializers/admin-user.serializer';
import { AdminUser } from './entities/admin-user.entity';

@ApiTags('Auth')
@ApiExtraModels(AdminUserSerializer, ListResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new admin user.',
    description:
      'Creates an admin user record with a bcrypt-hashed password. New accounts are active (status true) by default. Emails must be unique.',
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
    description:
      'Authenticates an active admin user and returns a JWT accessToken. Inactive accounts cannot log in until reactivated via PUT /auth/admins/:uuid/status.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin user logged in successfully. Copy data.accessToken for protected routes.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Account is inactive.',
  })
  async login(@Body() dto: LoginDto) {
    try {
      const { user, accessToken } = await this.authService.login(
        dto.email,
        dto.password,
      );
      return {
        message: MessageEnum.DATA_FETCHED_SUCCESSFULLY,
        data: { ...user, accessToken },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('admins')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all admin users.',
    description:
      'Returns a paginated list of admin users. Supports keyword search on email, first name, last name, and phone number.',
  })
  @ApiOkResponse({
    description: 'Admin users listed successfully.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(AdminUserSerializer) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required.',
  })
  async listAdmins(@Query() query: ListAdminsQueryDto) {
    try {
      const pagination = await this.authService.listAdmins(query);
      return {
        message: MessageEnum.MODULE_FETCHED_SUCCESSFULLY('Admin users'),
        data: pagination.results,
        pagination: pagination.paginationInfo,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('admins/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get admin user by UUID.',
    description: 'Returns a single admin user by their public UUID (`_id`).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin user fetched successfully.',
    type: AdminUserSerializer,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin user not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required.',
  })
  async getAdminByUuid(@Param() params: AdminUuidParamDto) {
    try {
      const data = await this.authService.getAdminByUuid(params.uuid);
      return {
        message: MessageEnum.MODULE_FETCHED_SUCCESSFULLY('Admin user'),
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('admins/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update admin user status.',
    description:
      'Sets an admin account active (true) or inactive (false) by UUID. Inactive users cannot log in until reactivated.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin user status updated successfully.',
    type: AdminUserSerializer,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin user not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Account is inactive (login only).',
  })
  async updateAdminStatus(
    @Param() params: AdminUuidParamDto,
    @Body() dto: UpdateAdminStatusDto,
  ) {
    try {
      const data = await this.authService.updateAdminStatus(params.uuid, dto);
      return {
        message: MessageEnum.MODULE_UPDATED_SUCCESSFULLY('Admin user status'),
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update logged-in admin user profile.',
    description:
      'Requires JWT. After login, click **Authorize** (lock icon, top right), paste `data.accessToken` only (no "Bearer " prefix), then call this endpoint.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin user updated successfully.',
    type: AdminUserSerializer,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Cannot update another admin profile.',
  })
  async updateAdminUser(
    @Body() dto: UpdateAdminDto,
    @GetUser() currentUser: AdminUser,
  ) {
    if (!currentUser) {
      throw new UnauthorizedException('Authentication required.');
    }

    try {
      const data = await this.authService.updateAdminUser(currentUser, dto);
      return {
        message: MessageEnum.MODULE_UPDATED_SUCCESSFULLY('Admin user'),
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change logged-in admin user password.',
    description:
      'Requires JWT. Validates the current password, then sets a new password for the authenticated user only.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully.',
    type: AdminUserSerializer,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Current password incorrect or new password invalid.',
  })
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @GetUser() currentUser: AdminUser,
  ) {
    if (!currentUser) {
      throw new UnauthorizedException('Authentication required.');
    }

    try {
      const data = await this.authService.changePassword(currentUser, dto);
      return {
        message: MessageEnum.MODULE_UPDATED_SUCCESSFULLY('Password'),
        data,
      };
    } catch (error) {
      throw error;
    }
  }
}
