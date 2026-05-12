import { Test, type TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { Server } from 'http';
import request from 'supertest';
import { AppModule } from './../src/app.module';

/** Opt-in: YAML always sets DB_* so use RUN_E2E=true when Postgres is up. */
const describeE2e =
  process.env['RUN_E2E'] === 'true' ? describe : describe.skip;

describeE2e('Auth validation (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix(process.env['API_PREFIX'] ?? 'api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  }, 30_000);

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/login rejects empty body', async () => {
    const res = await request(app.getHttpServer() as Server)
      .post('/api/auth/login')
      .send({});
    expect(res.status).toBe(400);
  });
});
