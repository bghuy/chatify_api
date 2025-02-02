import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { ErrorType } from 'src/utils/error';
import { DirectMessage } from '@prisma/client';
const MESSAGES_BATCH = 10;
@Injectable()
export class DirectMessagesService {

    constructor(private readonly prisma: PrismaService) {}

    async fetchDirectMessages(userId: string, cursor: any, conversationId: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            if(!conversationId){
                throw new HttpException('Conversation ID is missing', HttpStatus.BAD_REQUEST)
            }
            let messages : DirectMessage[] = [];
            if(cursor){
                messages = await this.prisma.directMessage.findMany({
                    take: MESSAGES_BATCH,
                    skip: 1,
                    cursor: {
                        id: cursor
                    },
                    where: {
                        conversationId:  conversationId,
                    },
                    include: {
                        member: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                })
            }else{
                messages = await this.prisma.directMessage.findMany({
                    take: MESSAGES_BATCH,
                    where: {
                        conversationId
                    },
                    include: {
                        member: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                })
            }
            let nextCursor = null;
            if(messages.length === MESSAGES_BATCH) {
                nextCursor = messages[MESSAGES_BATCH-1].id;
            }
            return {
                items: messages || [],
                nextCursor: nextCursor || null
            };
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
}
