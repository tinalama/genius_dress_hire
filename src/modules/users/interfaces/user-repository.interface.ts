import type { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import type { ListUsersQueryDto } from '../dto/request/list-users-query.dto';
import type { CreateUserDto } from '../dto/request/create-user.dto';
import type { User } from '../entities/user.entity';

export interface IUserRepository {
  create(data: CreateUserDto & { passwordHash: string }): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string, withPassword?: boolean): Promise<User | null>;
  findAllPaginated(query: ListUsersQueryDto): Promise<PaginatedResult<User>>;
  update(id: string, data: Partial<User>): Promise<User>;
  softDelete(id: string): Promise<void>;
}
