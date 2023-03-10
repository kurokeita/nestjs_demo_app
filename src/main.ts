import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwtAuth.guard';
import { AppConfig } from './config/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const appConfig = app.get(ConfigService).get<AppConfig>('app');

  await app.listen(appConfig?.port ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
