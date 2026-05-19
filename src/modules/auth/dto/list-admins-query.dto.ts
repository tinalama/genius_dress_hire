import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { CommonSearchFieldDto } from '../../../common-module/extra/common-search-field.dto';

export class ListAdminsQueryDto extends CommonSearchFieldDto {
  @ApiPropertyOptional({
    description: 'Sort fields. Prefix with - for DESC. Example: -createdAt,email',
    example: '-createdAt',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}
