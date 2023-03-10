import { Module } from "@nestjs/common";
import { UserModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { IsUniqueEmailConstraint } from "./validators/email_unique.validator";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [IsUniqueEmailConstraint],
})
export class AuthModule { }