import { Injectable } from "@nestjs/common"
import { UserService } from "src/users/users.service"
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.user({ email: email })

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    }

    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}