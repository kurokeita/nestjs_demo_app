import { Module } from "@nestjs/common";
import { UserService } from "src/users/users.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [UserService],
})
export class AuthModule { }