import { NestFactory } from '@nestjs/core';
import { TokenService } from './auth/token.service';
import { CronModule } from './cron/cron.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CronModule);
  const tokenService = app.get(TokenService);

  await tokenService.deleteExpiredRefreshTokens();

  await app.close();
}

bootstrap();
