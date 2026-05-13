import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync
} from 'node:crypto';
import { getConfig, GoogleConfig } from '@app/config';

const PREFIX = 'v1:';
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_LEN = 32;

function keyMaterialFromEnv(): string | undefined {
  const v = process.env.GOOGLE_OAUTH_TOKEN_ENCRYPTION_KEY?.trim();
  return v || undefined;
}

function keyMaterialFromConfig(): string | undefined {
  try {
    const k = getConfig<GoogleConfig>('google')?.authTokenEncryptionKey?.trim();
    return k || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Resolve key material: env `GOOGLE_OAUTH_TOKEN_ENCRYPTION_KEY` wins, then `google.authTokenEncryptionKey` in config.
 */
function getKeyMaterial(): string | undefined {
  return keyMaterialFromEnv() ?? keyMaterialFromConfig();
}

function getKey(): Buffer | null {
  const raw = getKeyMaterial();
  if (!raw) {
    return null;
  }
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    return Buffer.from(raw, 'hex');
  }
  return scryptSync(raw, 'google-oauth-token', KEY_LEN);
}

/**
 * AES-256-GCM encryption for Google OAuth tokens at rest.
 * When no key is configured (env or `google.authTokenEncryptionKey`), values are stored as plaintext (dev only).
 */
export function encryptGoogleOAuthTokenAtRest(plain: string): string {
  const key = getKey();
  if (!key) {
    return plain;
  }
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${Buffer.concat([iv, tag, enc]).toString('base64')}`;
}

/**
 * Decrypts values produced by encryptGoogleOAuthTokenAtRest, or returns legacy plaintext.
 */
export function decryptGoogleOAuthTokenFromDb(stored: string): string {
  if (!stored.startsWith(PREFIX)) {
    return stored;
  }
  const key = getKey();
  if (!key) {
    throw new Error(
      'Google OAuth token decryption requires GOOGLE_OAUTH_TOKEN_ENCRYPTION_KEY or google.authTokenEncryptionKey in config'
    );
  }
  const raw = Buffer.from(stored.slice(PREFIX.length), 'base64');
  const iv = raw.subarray(0, IV_LEN);
  const tag = raw.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const data = raw.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString(
    'utf8'
  );
}
