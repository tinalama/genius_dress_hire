import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Validation failed' })
  message!: string | string[];

  @ApiProperty({ example: 'Bad Request', required: false })
  error?: string;

  @ApiProperty({ example: {}, required: false })
  details?: any;
}
