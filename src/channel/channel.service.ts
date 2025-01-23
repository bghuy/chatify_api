import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { ErrorType } from './../utils/error';

@Injectable()
export class ChannelService {

    constructor(private readonly prisma: PrismaService) { }
    async fetchChannelById (channelId: string) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: channelId
                }
            })
            return channel;
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
