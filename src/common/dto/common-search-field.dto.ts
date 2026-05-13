import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, Min, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class CommonSearchFieldDto {
  @ApiPropertyOptional({ name: 'keyword' })
  @ValidateIf((object, value) => value)
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
  limit: number = 20;

  @ApiPropertyOptional()
  @ValidateIf((object, value) => value != null)
  @Transform(({ value }) => Number.parseInt(value), {
    toClassOnly: true
  })
  @Min(1, {
    message: 'min-{"ln":1,"count":1}'
  })
  page: number;
}

export class FindByIdParams {
  @ApiPropertyOptional()
  @IsUUID()
  @IsString()
  id: string;
}