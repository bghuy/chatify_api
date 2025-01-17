import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator"

export class ServerCreateDto {
    @IsString()
    @MinLength(1)
    name: string
    
    image: string
    inviteCode?: string
}