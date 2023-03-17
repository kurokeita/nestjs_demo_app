import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/users.service';
import { LoggedInDto } from './dto/loggedIn.dto';
import { RefreshDto } from './dto/refresh.dto';
import { TokenService } from './token.service';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.user({ email: email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any): Promise<LoggedInDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.tokenService.sign(payload),
      refresh_token: await this.tokenService.createRefreshToken(user),
    } as LoggedInDto;
  }

  async refresh(refreshDto: RefreshDto) {
    const decodedJwtAccessToken = this.verifyAccessToken(
      refreshDto.access_token,
    );

    if (decodedJwtAccessToken === undefined) {
      return null;
    }

    const refreshToken = await this.tokenService.verifyRefreshToken(
      refreshDto.refresh_token,
      decodedJwtAccessToken.sub,
    );

    if (!refreshToken) {
      return null;
    }

    const user = await this.userService.user({
      id: decodedJwtAccessToken.sub,
    });

    await this.tokenService.invalidateRefreshToken(refreshToken);

    return this.login(user);
  }

  private verifyAccessToken(token: string): JwtPayload | undefined {
    try {
      return this.tokenService.verify(token);
    } catch (e) {
      // TODO: need better way to check for exeption type
      if (e.name !== 'TokenExpiredError') {
        throw new UnauthorizedException();
      }

      return this.tokenService.decode(token);
    }
  }
}
