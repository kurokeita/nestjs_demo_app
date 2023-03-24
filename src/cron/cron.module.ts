import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/auth/token.service';
import configuration from 'src/config/configuration';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
  ],
  providers: [ConfigService, TokenService, JwtService],
})
export class CronModule {}
