import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { UserService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { Public } from './public.decorator';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('/register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response,
  ): Promise<Response> {
    registerDto.password = await bcrypt.hash(
      registerDto.password,
      await bcrypt.genSalt(10),
    );
    const user = await this.userService.createUser(registerDto);

    return res.status(HttpStatus.CREATED).send(user);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response): Promise<any> {
    return res
      .status(HttpStatus.OK)
      .send(await this.authService.login(req.user));
  }

  @Get('/me')
  async me(@Req() req: Request, @Res() res: Response): Promise<any> {
    return res.status(HttpStatus.OK).send(req.user);
  }

  @Public()
  @Post('/refresh')
  async refresh(
    @Body() refreshDto: RefreshDto,
    @Res() res: Response,
  ): Promise<Response> {
    return res
      .status(HttpStatus.OK)
      .send(await this.authService.refresh(refreshDto));
  }
}
