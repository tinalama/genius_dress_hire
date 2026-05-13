import '../../config/load-env-first';
import * as bcrypt from 'bcrypt';
import AppDataSource from '../../ormconfig';
import { AdminUser } from '../../modules/auth/entities/admin-user.entity';

async function seed(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(AdminUser);
  const email = 'admin@example.com';
  const existing = await repo.findOne({ where: { email } });
  if (existing) {
    console.info('Seed skipped: admin user already exists');
    await AppDataSource.destroy();
    return;
  }
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash('ChangeMe123!', salt);
  await repo.save(
    repo.create({
      email,
      password: passwordHash,
      salt,
      firstName: 'Admin',
      lastName: 'User',
      status: true,
    }),
  );
  console.info('Seed completed: admin@example.com / ChangeMe123!');
  await AppDataSource.destroy();
}

void seed().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
