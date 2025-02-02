import { ChannelType } from "@prisma/client";

export type CreateChannelType = {
    name: string;
    type: ChannelType;
}