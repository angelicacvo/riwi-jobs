import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Health check controller for monitoring application status
 * Public endpoint - no authentication required
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  /**
   * Health check endpoint
   * Returns application status and uptime
   */
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-01-05T17:00:00.000Z',
        uptime: 123.45,
      },
    },
  })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
