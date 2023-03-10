import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { UserService } from './users.service';
import { Response } from 'express';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async index(@Res() res: Response): Promise<Response> {
    const users = await this.userService.users({});

    return res.status(HttpStatus.OK).send({ data: users, count: users.length });
  }

  @Get('/:id')
  async show(@Param('id') id: number, @Res() res: Response): Promise<Response> {
    if (isNaN(id)) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid ID' });
    }

    const user = await this.userService.user({ id });

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return res.status(HttpStatus.OK).send(rest);
    }

    return res.status(HttpStatus.NOT_FOUND).send({ message: 'User not found' });
  }
}
