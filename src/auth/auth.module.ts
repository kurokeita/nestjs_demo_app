import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { IsUniqueEmailConstraint } from "./validators/email_unique.validator";

@Module({
  imports: [UserModule, PassportModule],
  controllers: [AuthController],
  providers: [IsUniqueEmailConstraint, AuthService, LocalStrategy],
})
export class AuthModule { }