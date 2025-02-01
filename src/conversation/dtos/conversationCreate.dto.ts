import { IsNotEmpty, IsString } from "class-validator";

export class ConversationCreateDto {
    @IsString()
    @IsNotEmpty()
    memberOneId: string;

    @IsString()
    @IsNotEmpty()
    memberTwoId: string;
}