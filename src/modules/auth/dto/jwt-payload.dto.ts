export interface JwtPayloadDto {
  /** Internal admin-user id (matches `AdminUser.id`). */
  subject: number;

  /** Public UUID of the admin user (matches `AdminUser.uuid`). */
  uuid?: string;

  /** Email captured at token-issue time. */
  email?: string;

  /** Issued-at (seconds since epoch). Populated by `JwtService.sign`. */
  iat?: number;

  /** Expiry (seconds since epoch). Populated by `JwtService.sign`. */
  exp?: number;
}
