import './config/load-env-first';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { User } from './modules/users/entities/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: parseInt(process.env['DB_PORT'] ?? '5432', 10),
  username: process.env['DB_USERNAME'] ?? 'postgres',
  password: process.env['DB_PASSWORD'] ?? 'postgres',
  database: process.env['DB_NAME'] ?? 'genius_dress_hire',
  entities: [User],
  migrations: [resolve(__dirname, 'database', 'migrations', '*.{ts,js}')],
  synchronize: false,
  logging: process.env['DB_LOGGING'] === 'true',
});
