import { IsEmail, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    comment: string;
}