import { Controller, Get, HttpException, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { DirectMessagesService } from './direct-messages.service';
import { JwtGuard } from './../guards/jwt.guard';
import { ErrorType } from './../utils/error';
import { AuthenticatedUserType } from 'src/utils/types/auth';
import { Request } from 'express';

@Controller('direct-messages')
export class DirectMessagesController {

    constructor(
        private readonly directMessagesService: DirectMessagesService
    ) {}

    @Get()
    @UseGuards(JwtGuard)
    async getMessages(
        @Query('cursor') cursor: any, 
        @Query('conversationId') conversationId: string,
        @Req() req: Request
    ) {
        
        try {
            const data = await this.directMessagesService.fetchDirectMessages((req.user as AuthenticatedUserType)?.id, cursor, conversationId);
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
