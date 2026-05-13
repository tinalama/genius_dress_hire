import { ValueTransformer } from 'typeorm';
import {
  decryptGoogleOAuthTokenFromDb,
  encryptGoogleOAuthTokenAtRest
} from '../crypto/google-oauth-token-at-rest';

/** TypeORM column transformer: encrypt on write, decrypt on read (user table). */
export const googleOAuthAccessTokenColumnTransformer: ValueTransformer = {
  to: (value: string | null | undefined) =>
    value == null || value === ''
      ? value
      : encryptGoogleOAuthTokenAtRest(value),
  from: (value: string | null | undefined) =>
    value == null || value === '' ? value : decryptGoogleOAuthTokenFromDb(value)
};

export const googleOAuthRefreshTokenColumnTransformer: ValueTransformer = {
  to: (value: string | null | undefined) =>
    value == null || value === ''
      ? value
      : encryptGoogleOAuthTokenAtRest(value),
  from: (value: string | null | undefined) =>
    value == null || value === '' ? value : decryptGoogleOAuthTokenFromDb(value)
};
