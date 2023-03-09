import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { UserService } from "src/users/users.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcrypt'
import { LoginDto } from "./dto/login.dto";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly userService: UserService) { }

  @Post('/register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response
  ): Promise<Response> {
    registerDto.password = await bcrypt.hash(registerDto.password, await bcrypt.genSalt(10))
    const user = await this.userService.createUser(registerDto)

    return res.status(HttpStatus.CREATED).send(user)
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response
  ): Promise<Response> {
    const user = await this.userService.user({ email: loginDto.email })

    if (user && await bcrypt.compare(loginDto.password, user.password)) {
      return res.status(HttpStatus.OK).send({ message: 'Logged in' })
    }

    return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Invalid credentials' })
  }
}