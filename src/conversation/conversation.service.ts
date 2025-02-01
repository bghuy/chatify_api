import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { ErrorType } from './../utils/error';

@Injectable()
export class ConversationService {
    constructor(private readonly prisma: PrismaService) {}
    
    async fetchConversation(userId: string, memberOneId: string, memberTwoId: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            const conversation = await this.prisma.conversation.findFirst({
                where: {
                    AND: [
                        {memberOneId: memberOneId},
                        {memberTwoId: memberTwoId}
                    ]
                },
                include: {
                    memberOne: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    emailVerified: true,
                                    image: true,
                                    role: true,
                                    createdAt: true,
                                    updatedAt: true,   
                                }
                            }
                        }
                    },
                    memberTwo: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    emailVerified: true,
                                    image: true,
                                    role: true,
                                    createdAt: true,
                                    updatedAt: true,   
                                }
                            }
                        }
                    }
                }
            })
            return conversation;
        } catch (error) {
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async createConversation(userId: string, memberOneId: string, memberTwoId: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            const conversation = await this.prisma.conversation.create({
                data: {
                    memberOneId,
                    memberTwoId
                },
                include: {
                    memberOne: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    emailVerified: true,
                                    image: true,
                                    role: true,
                                    createdAt: true,
                                    updatedAt: true,   
                                }
                            }
                        }
                    },
                    memberTwo: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    emailVerified: true,
                                    image: true,
                                    role: true,
                                    createdAt: true,
                                    updatedAt: true,   
                                }
                            }
                        }
                    }
                }
            })
            return conversation;
        } catch (error) {
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}
