import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { IsUniqueEmail } from '../validators/email_unique.validator';

export class RegisterDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsUniqueEmail({
    message: 'email $value already exists',
  })
  email: string;

  @IsNotEmpty()
  @Length(8, 20)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
