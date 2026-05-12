import '../../config/load-env-first';
import * as bcrypt from 'bcrypt';
import AppDataSource from '../../ormconfig';
import { User } from '../../modules/users/entities/user.entity';

async function seed(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(User);
  const email = 'admin@example.com';
  const existing = await repo.findOne({ where: { email } });
  if (existing) {
    console.info('Seed skipped: user already exists');
    await AppDataSource.destroy();
    return;
  }
  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);
  await repo.save(
    repo.create({
      email,
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
    }),
  );
  console.info('Seed completed: admin@example.com / ChangeMe123!');
  await AppDataSource.destroy();
}

void seed().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
