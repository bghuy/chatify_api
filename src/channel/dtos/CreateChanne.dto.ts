import { ChannelType } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateChannelDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: ChannelType;
}

export class UpdateChannelDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: ChannelType;
}