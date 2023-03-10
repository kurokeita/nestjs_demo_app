import { Injectable } from "@nestjs/common"
import { UserService } from "src/users/users.service"
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.user({ email: email })

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user
      return result
    }

    return null
  }
}