import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsEqualTo } from '../../../common-module/decorators/is-equal-to.decorator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Tina@123', description: 'Current account password.' })
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({
    example: 'NewSecure123!',
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
  newPassword!: string;

  @ApiProperty({ example: 'NewSecure123!' })
  @IsString()
  @IsNotEmpty()
  @IsEqualTo('newPassword', { message: 'confirmPassword must match newPassword.' })
  confirmPassword!: string;
}
