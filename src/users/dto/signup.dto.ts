import { IsEmail, IsNotEmpty, isNotEmpty, IsString, MinLength } from "class-validator"

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    name: string
    
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    password: string
}