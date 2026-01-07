import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verificar estado del servidor' })
  @ApiResponse({
    status: 200,
    description: 'Servidor funcionando correctamente',
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
