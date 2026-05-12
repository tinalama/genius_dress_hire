import { Test, type TestingModule } from '@nestjs/testing';
import { ResourceNotFoundException } from '../../../common/exceptions/resource-not-found.exception';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserSerializer } from '../serializers/user.serializer';
import { UsersService } from '../services/users.service';

describe('UsersService', () => {
  let service: UsersService;
  const repo: Pick<
    UserRepository,
    | 'findById'
    | 'findByEmail'
    | 'create'
    | 'findAllPaginated'
    | 'update'
    | 'softDelete'
  > = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    findAllPaginated: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };
  const serializer: Pick<UserSerializer, 'toResponse' | 'toResponseList'> = {
    toResponse: jest.fn((u: User) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      deletedAt: u.deletedAt,
    })),
    toResponseList: jest.fn(() => []),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: repo },
        { provide: UserSerializer, useValue: serializer },
      ],
    }).compile();
    service = module.get(UsersService);
    jest.clearAllMocks();
  });

  it('throws when user not found', async () => {
    (
      repo.findById as jest.MockedFunction<typeof repo.findById>
    ).mockResolvedValue(null);
    await expect(
      service.findOne('00000000-0000-0000-0000-000000000000'),
    ).rejects.toBeInstanceOf(ResourceNotFoundException);
  });

  it('maps serializer on findOne', async () => {
    const user: User = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'a@b.com',
      firstName: 'A',
      lastName: 'B',
      passwordHash: 'x',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    (
      repo.findById as jest.MockedFunction<typeof repo.findById>
    ).mockResolvedValue(user);
    await service.findOne(user.id);
    expect(serializer.toResponse).toHaveBeenCalledWith(user);
  });
});
