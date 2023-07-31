import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(40)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  password: string;
}
