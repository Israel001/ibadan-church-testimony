import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateTestimonyDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsString()
  country: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  categoryUuid: string;

  @IsBoolean()
  anonymous: boolean;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  testimony: string;

  @IsString()
  @IsOptional()
  userUuid: string;
}
