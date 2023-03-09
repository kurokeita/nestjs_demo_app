import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './config/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  const appConfig = app.get(ConfigService).get<AppConfig>('app');

  await app.listen(appConfig?.port ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
