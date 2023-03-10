import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { UserService } from "src/users/users.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcrypt'
import { LocalAuthGuard } from "./guards/localAuth.guard";
import { AuthService } from "./auth.service";
import { Public } from "./public.decorator";

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) { }

  @Public()
  @Post('/register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response
  ): Promise<Response> {
    registerDto.password = await bcrypt.hash(registerDto.password, await bcrypt.genSalt(10))
    const user = await this.userService.createUser(registerDto)

    return res.status(HttpStatus.CREATED).send(user)
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<any> {
    return res.status(HttpStatus.OK).send(await this.authService.login(req.user))
  }

  @Get('/me')
  async me(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<any> {
    console.log(req.user);

    return res.status(HttpStatus.OK).send(req.user)
  }
}