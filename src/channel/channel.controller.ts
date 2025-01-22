import { Controller, Get, HttpException, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { JwtGuard } from './../guards/jwt.guard';
import { ErrorType } from './../utils/error';

@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @Get(':channelId')
    @UseGuards(JwtGuard)
    async getChannelById(
        @Param('channelId') channelId: string,
    ) {
        try {
            const channel = await this.channelService.fetchChannelById(channelId);
            return { message: 'Channel found', data: {channel} }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

    }

}
