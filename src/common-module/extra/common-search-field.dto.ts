import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CommonSearchFieldDto {
  @ApiPropertyOptional({ name: 'keyword' })
  @ValidateIf((object, value) => value)
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  keyword: string;

  @ApiPropertyOptional()
  @ValidateIf((object, value) => value)
  @Transform(({ value }) => Number.parseInt(value), {
    toClassOnly: true
  })
  @Min(1, {
    message: 'min-{"ln":1,"count":1}'
  })
  limit: number;

  @ApiPropertyOptional()
  @ValidateIf((object, value) => value != null)
  @Transform(({ value }) => Number.parseInt(value), {
    toClassOnly: true
  })
  @Min(1, {
    message: 'min-{"ln":1,"count":1}'
  })
  page: number;

  @ApiPropertyOptional({
    description: 'Bypass cache and force fresh data',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  forceRefresh?: boolean;
}

export class FindByIdParams {
  @ApiPropertyOptional()
  @IsUUID()
  @IsString()
  id: string;
}
