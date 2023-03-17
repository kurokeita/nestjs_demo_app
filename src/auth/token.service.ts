import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Prisma, RefreshToken, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { PrismaService } from 'src/db/prisma.service';
import { JwtPayload } from './types';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  sign(payload: any, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  verify(token: string): JwtPayload {
    return this.jwtService.verify(token) as JwtPayload;
  }

  decode(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }

  async createRefreshToken(user: User): Promise<string> {
    const token = bcrypt.hashSync(user.email, bcrypt.genSaltSync(10));
    const data: Prisma.RefreshTokenUncheckedCreateInput = {
      token: token,
      user_id: user.id,
      issued_at: moment().toDate(),
      expired_at: moment()
        .add(this.configService.get('jwt.refresh_token_expirationo_time'), 's')
        .toDate(),
    };

    await this.prisma.refreshToken.create({ data });

    return token;
  }

  async verifyRefreshToken(
    token: string,
    userId: number,
  ): Promise<RefreshToken | null> {
    return await this.prisma.refreshToken.findFirst({
      where: {
        user_id: userId,
        token: token,
      },
    });
  }

  async invalidateRefreshToken(token: RefreshToken | string) {
    if (typeof token === 'string') {
      await this.prisma.refreshToken.delete({
        where: {
          token: token,
        },
      });
    } else {
      await this.prisma.refreshToken.delete({
        where: {
          id: token.id,
        },
      });
    }
  }
}
