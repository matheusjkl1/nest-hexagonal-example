import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
@ApiTags('HealthCheck')
export class HealthCheckController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Get('check')
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => await this.db.pingCheck('database', { timeout: 2000 }),
    ]);
  }
}
