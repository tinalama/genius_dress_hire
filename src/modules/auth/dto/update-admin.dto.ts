import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateAdminDto {
  @ApiPropertyOptional({ example: 'admin@example.com', maxLength: 200 })
  @IsOptional()
  @IsEmail({}, { message: 'A valid email address is required.' })
  @MaxLength(200)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email?: string;

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