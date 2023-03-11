import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  sign(payload: any, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

  async createRefreshToken(user: User): Promise<string> {
    const token = bcrypt.hashSync(user.email, bcrypt.genSaltSync(10));
    const data: Prisma.RefreshTokenUncheckedCreateInput = {
      token: token,
      user_id: user.id,
      issued_at: moment().toDate(),
      expired_at: moment().add(7, 'days').toDate(),
    };

    await this.prisma.refreshToken.create({ data });

    return token;
  }

  async verifyRefreshToken(token: string, userId: number): Promise<boolean> {
    const count = await this.prisma.refreshToken.count({
      where: {
        user_id: userId,
        token: token,
      },
    });

    return count > 0;
  }
}
