export const ExceptionTitleList = {
  NotFound: 'NOT_FOUND',
  Conflict: 'CONFLICT',
  Forbidden: 'FORBIDDEN',
  Unauthorized: 'UNAUTHORIZED',
  IncorrectOldPassword: 'INCORRECT_OLD_PASSWORD',
  UserInactive: 'USER_INACTIVE',
  UserDisabled: 'USER_DISABLED',
  BadRequest: 'BAD_REQUEST',
  UnprocessableEntity: 'UNPROCESSABLE_ENTITY',
  InvalidCredentials: 'INVALID_CREDENTIALS',
  InvalidRefreshToken: 'INVALID_REFRESH_TOKEN',
  DeleteDefaultError: 'DELETE_DEFAULT_ERROR',
  RefreshTokenExpired: 'REFRESH_TOKEN_EXPIRED',
  TooManyTries: 'tooManyTries',
  InternalServerError: 'INTERNAL_SERVER_ERROR'
} as const;
