import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { JwtGuard } from './../guards/jwt.guard';
import { Request } from 'express';
import { ErrorType } from './../utils/error';
import { AuthenticatedUserType } from './../utils/types/auth';
import { ConversationCreateDto } from './dtos/conversationCreate.dto';

@Controller('conversation')
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    @Get()
    @UseGuards(JwtGuard)
    async getConversation(
        @Query('memberOneId') memberOneId: string,
        @Query('memberTwoId') memberTwoId: string,
        @Req() req: Request
    ) {
        try {
            const conversation = await this.conversationService.fetchConversation((req.user as AuthenticatedUserType)?.id, memberOneId, memberTwoId);
            return { message: 'Conversation found', data: {conversation} }
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
    async createConversation (
        @Body() {memberOneId, memberTwoId}: ConversationCreateDto,
        @Req() req: Request
    ) {
        try {
            const conversation = await this.conversationService.createConversation((req.user as AuthenticatedUserType)?.id, memberOneId, memberTwoId);
            return { message: 'Conversation created', data: {conversation} }
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
