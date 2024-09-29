import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  fullname: string;

  @IsEmail()
  @Length(1, 200)
  email: string;

  @IsString()
  @Length(1, 50)
  password: string;
}
