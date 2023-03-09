import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AppConfig from './config/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig = app.get(ConfigService).get<AppConfig>('app');

  await app.listen(appConfig?.host ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
