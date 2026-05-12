import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UserSerializer } from './serializers/user.serializer';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserRepository, UsersService, UserSerializer],
  exports: [UsersService, UserRepository, UserSerializer],
})
export class UsersModule {}
