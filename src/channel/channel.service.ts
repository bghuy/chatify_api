import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { ErrorType } from './../utils/error';
import { CreateChannelType } from './../utils/types/channel';
import { MemberRole } from '@prisma/client';

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
    async createChannel(userId: string, serverId: string, body: CreateChannelType) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            if(!serverId) return new HttpException("Server ID missing", HttpStatus.BAD_REQUEST);
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    members: {
                        some: {
                            userId: userId,
                            role: {
                                in: [MemberRole.ADMIN , MemberRole.MODERATOR]
                            }
                        }
                    }
                },
                data: {
                    channels: {
                        create: {
                            userId: userId,
                            name: body?.name,
                            type: body?.type
                        }
                    }
                }
            })
            return server;
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateChannel(userId: string, serverId: string, channelId: string, body: CreateChannelType) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            if(!serverId) return new HttpException("Server ID missing", HttpStatus.BAD_REQUEST);
            if(!channelId) return new HttpException("Channel ID missing", HttpStatus.BAD_REQUEST)
            if(body.name === "general") return new HttpException("Name cannot be 'general'", HttpStatus.BAD_REQUEST);
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    members: {
                        some: {
                            userId: userId,
                            role: {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                            }
                        }
                    }
                },
                data: {
                    channels : {
                        update: {
                            where: {
                                id: channelId,
                                NOT: {
                                    name: "general"
                                }
                            },
                            data: {
                                name: body?.name,
                                type: body?.type
                            }
                        }
                    }
                }
            })
            return server;
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteChannel(userId: string, serverId: string, channelId: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            if(!serverId) return new HttpException("Server ID missing", HttpStatus.BAD_REQUEST);
            if(!channelId) return new HttpException("Channel ID missing", HttpStatus.BAD_REQUEST)
                const server = await this.prisma.server.update({
                    where: {
                        id: serverId,
                        members: {
                            some: {
                                userId: userId,
                                role: {
                                    in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                                }
                            }
                        }
                    },
                    data: {
                        channels: {
                            delete: {
                                id: channelId,
                                name: {
                                    not: "general"
                                }
                            }
                        }
                    }
                })
            return server;
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
