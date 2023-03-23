import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import configuration from './config/configuration';
import { PrismaModule } from './db/prisma.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
      {
        path: 'api',
        children: [
          {
            path: 'users',
            module: UserModule,
          },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtStrategy,
    },
  ],
})
export class AppModule {}
