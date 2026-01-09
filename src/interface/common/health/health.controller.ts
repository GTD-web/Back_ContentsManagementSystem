import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';

/**
 * 헬스체크 컨트롤러
 *
 * 애플리케이션의 상태를 확인하는 API를 제공합니다.
 */
@ApiTags('헬스체크')
@Controller('health')
export class HealthController {
  /**
   * 기본 헬스체크
   */
  @Public()
  @Get()
  @ApiOperation({
    summary: '헬스체크',
    description: '애플리케이션이 정상적으로 실행 중인지 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '정상',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
      },
    },
  })
  checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
