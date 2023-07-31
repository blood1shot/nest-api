import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(40)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  password: string;
}
