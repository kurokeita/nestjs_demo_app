import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TokenService } from './token.service';
import { IsUniqueEmailConstraint } from './validators/email_unique.validator';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: configService.get('jwt.access_token_private_key'),
          publicKey: configService.get('jwt.access_token_public_key'),
          signOptions: {
            expiresIn: parseInt(
              configService.get('jwt.access_token_expiration_time') ?? '60',
            ),
            algorithm: 'RS256',
          },
        };

        return options;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    IsUniqueEmailConstraint,
    AuthService,
    TokenService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
