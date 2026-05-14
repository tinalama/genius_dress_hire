import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({ example: 'admin@example.com', maxLength: 200 })
  @IsEmail({}, { message: 'A valid email address is required.' })
  @MaxLength(200)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email!: string;

  @ApiProperty({
    example: 'ChangeMe123!',
    description:
      'At least 8 characters, must include one letter and one number.',
    minLength: 8,
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(64, { message: 'Password must be 64 characters or fewer.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number.',
  })
  password!: string;

  @ApiPropertyOptional({ example: 'Tina', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Sharma', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  lastName?: string;

  @ApiPropertyOptional({ example: '+977-9800000000', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;
}
