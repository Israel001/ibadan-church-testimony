import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationInput } from 'src/base/dto';
import { IsValidDate } from 'src/tools/date-validator';
import { TestimonyStatus } from 'src/types';

export class AdminLoginDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class CreateCategoryDto {
  @IsString()
  name: string;
}

export class CustomerFilter {
  @IsOptional()
  @IsValidDate()
  startDate?: Date;

  @IsOptional()
  @IsValidDate()
  endDate?: Date;
}

export class GeneralQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @ValidateNested()
  @Type(() => PaginationInput)
  pagination?: PaginationInput;
}

export class CustomerQuery {
  @ValidateNested()
  @Type(() => CustomerFilter)
  @IsOptional()
  filter?: CustomerFilter;

  @IsOptional()
  @IsString()
  search?: string;

  @ValidateNested()
  @Type(() => PaginationInput)
  pagination?: PaginationInput;
}

export class UpdateTestimonyDto {
  @IsString()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  categoryUuid: string;

  @IsBoolean()
  @IsOptional()
  anonymous: boolean;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  testimony: string;

  @IsString()
  @IsOptional()
  userUuid: string;

  @IsString()
  @IsOptional()
  rejectionReason: string;

  @IsEnum(TestimonyStatus)
  @IsOptional()
  status: TestimonyStatus;
}

export class CreateAdminTestimonyDto {
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

  @IsBoolean()
  isFeatured: false;

  @IsEnum(TestimonyStatus)
  status: TestimonyStatus;

  @IsString()
  image: string;

  @IsString()
  testimony: string;
}

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  comment: string;
}

export class TestimonyQuery {
  @IsOptional()
  @IsEnum(TestimonyStatus)
  status: TestimonyStatus;
}

export class CreateModeratorDto {
  @IsString()
  fullname: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;
}
