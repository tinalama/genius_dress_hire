import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T = any> {
  @ApiProperty({ example: 'Success message' })
  message!: string;

  @ApiProperty({ example: {} })
  data!: T;

  constructor(message: string, data: T) {
    this.message = message;
    this.data = data;
  }
}
