import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDto<T = any> {
  @ApiProperty({ example: 'Items fetched successfully' })
  message!: string;

  @ApiProperty({ example: [{}], isArray: true })
  data!: T[];

  @ApiProperty({
    example: {
      current_page: 1,
      per_page: 10,
      total: 100,
      total_pages: 10,
      prevPage: 0,
      nextPage: 2,
    },
    required: false,
  })
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    prevPage: number;
    nextPage: number;
  };
}
