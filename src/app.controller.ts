import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get('/health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Service health check' })
  @ApiOkResponse({
    description: 'Returns service liveness state.',
    schema: {
      example: {
        status: 'ok',
        service: 'genius_dress_hire',
        timestamp: '2026-05-14T05:10:00.000Z',
      },
    },
  })
  health(): { status: string; service: string; timestamp: string } {
    return {
      status: 'ok',
      service: 'genius_dress_hire',
      timestamp: new Date().toISOString(),
    };
  }
}
