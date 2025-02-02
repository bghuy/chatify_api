import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { JwtGuard } from './../guards/jwt.guard';
import { ErrorType } from './../utils/error';
import { CreateChannelDto, UpdateChannelDto } from './dtos/CreateChanne.dto';
import { Request } from 'express';
import { AuthenticatedUserType } from './../utils/types/auth';

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

    @Post()
    @UseGuards(JwtGuard)
    @UsePipes(ValidationPipe)
    async createChannel(
        @Query('serverId') serverId: string,
        @Body() body: CreateChannelDto,
        @Req() req: Request
    ) {
        try {
            const server = await this.channelService.createChannel((req.user as AuthenticatedUserType)?.id, serverId, body);
            return { message: 'Channel created', data: {server} }
        }
        catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Patch(':channelId')
    @UseGuards(JwtGuard)
    @UsePipes(ValidationPipe)
    async updateChannel(
        @Param('channelId') channelId: string,
        @Query('serverId') serverId: string,
        @Body() body: UpdateChannelDto,
        @Req() req: Request
    ) {
        try {
            const server = await this.channelService.updateChannel((req.user as AuthenticatedUserType)?.id, serverId,  channelId, body);
            return { message: 'Channel updated', data: {server} }
        }
        catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':channelId')
    @UseGuards(JwtGuard)
    async deleteChannel(
        @Param('channelId') channelId: string,
        @Query('serverId') serverId: string,
        @Req() req: Request
    ) {
        try {
            const server = await this.channelService.deleteChannel((req.user as AuthenticatedUserType)?.id, serverId, channelId);
            return { message: 'Channel deleted', data: {server} }
        }
        catch (error) {
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
