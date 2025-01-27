import { Controller, Get, HttpException, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtGuard } from './../guards/jwt.guard';
import { ErrorType } from './../utils/error';
import { Request } from 'express';
import { AuthenticatedUserType } from './../utils/types/auth';

@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService
    ) {}

    @Get()
    @UseGuards(JwtGuard)
    async getMessages(
        @Query('cursor') cursor: any, 
        @Query('channelId') channelId: string,
        @Req() req: Request
    ) {
        
        try {
            const data = await this.messagesService.fetchMessages((req.user as AuthenticatedUserType)?.id, cursor, channelId,);
            return { message: 'Messages found', data: {...data} }
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
