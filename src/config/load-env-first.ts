/**
 * Matches TTC stack: dotenv first, then node-config (config/*.yml + custom-environment-variables.json),
 * then mirror merged values onto process.env for Joi + existing Nest env usage.
 *
 * Uses safe reads with defaults so a partial config/local.yml (e.g. only db.username) does not drop
 * sibling keys like db.logging — node-config would otherwise throw on undefined config.get().
 */
import { config as dotenvLoad } from 'dotenv';
import { resolve } from 'path';

dotenvLoad({ path: resolve(process.cwd(), '.env') });

// Must load after dotenv so CUSTOM_ENV_VARIABLES sees .env (CommonJS order).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodeConfig = require('config') as typeof import('config');

function cfg<T>(key: string, fallback: T): T {
  return nodeConfig.has(key) ? nodeConfig.get(key) : fallback;
}

function boolToEnv(v: unknown): string {
  if (typeof v === 'boolean') {
    return v ? 'true' : 'false';
  }
  if (v === 'true' || v === 'false') {
    return v;
  }
  return v ? 'true' : 'false';
}

function applyYamlConfigToProcessEnv(): void {
  process.env.NODE_ENV = String(cfg('nodeEnv', 'development'));

  process.env.PORT = String(cfg('server.port', 3000));
  process.env.API_PREFIX = String(cfg('server.apiPrefix', 'api'));

  if (nodeConfig.has('server.origin')) {
    process.env.CORS_ORIGIN = String(nodeConfig.get('server.origin'));
  } else if (nodeConfig.has('server.corsOrigin')) {
    process.env.CORS_ORIGIN = String(nodeConfig.get('server.corsOrigin'));
  } else {
    process.env.CORS_ORIGIN = '*';
  }

  process.env.DB_HOST = String(cfg('db.host', 'localhost'));
  process.env.DB_PORT = String(cfg('db.port', 5432));
  process.env.DB_USERNAME = String(cfg('db.username', 'postgres'));
  process.env.DB_PASSWORD = String(cfg('db.password', 'postgres'));
  process.env.DB_NAME = String(cfg('db.database', 'genius_dress_hire'));
  process.env.DB_SYNCHRONIZE = boolToEnv(cfg('db.synchronize', false));
  process.env.DB_LOGGING = boolToEnv(cfg('db.logging', false));

  process.env.JWT_SECRET = String(
    cfg('jwt.secret', 'change-me-min-16-chars!!'),
  );
  process.env.JWT_EXPIRES_IN = String(cfg('jwt.expiresIn', '7d'));

  process.env.SWAGGER_ENABLED = boolToEnv(cfg('app.swaggerEnabled', true));
}

applyYamlConfigToProcessEnv();
