import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { ErrorType } from './../utils/error';
import { Message } from '@prisma/client';
const MESSAGES_BATCH = 10;
@Injectable()
export class MessagesService {

    constructor(private readonly prisma: PrismaService) {}

    async fetchMessages(userId: string, cursor: any, channelId: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            if(!channelId){
                throw new HttpException('Channel ID is missing', HttpStatus.BAD_REQUEST)
            }
            let messages : Message[] = [];
            if(cursor){
                messages = await this.prisma.message.findMany({
                    take: MESSAGES_BATCH,
                    skip: 1,
                    cursor: {
                        id: cursor
                    },
                    where: {
                        channelId:  channelId,
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
                messages = await this.prisma.message.findMany({
                    take: MESSAGES_BATCH,
                    where: {
                        channelId
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
