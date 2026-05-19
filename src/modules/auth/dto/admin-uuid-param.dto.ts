import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AdminUuidParamDto {
  @ApiProperty({
    description: 'Admin user public UUID',
    example: 'f2c1d3db-d9be-4956-bcb4-5cf00f1bb86c',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'A valid admin user UUID is required.' })
  uuid!: string;
}
