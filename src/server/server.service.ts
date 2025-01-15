import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MemberRole, Prisma } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { ErrorType } from './../utils/error';
import { ServerCreateInputType } from './../utils/types/server';
import {v4 as uuidv4} from "uuid"
@Injectable()
export class ServerService {
    constructor(private readonly prisma: PrismaService) { }

    async fetchServerById(serverId: string) {
        if(!serverId) throw new HttpException("serverId is missing", HttpStatus.BAD_REQUEST);
        try {
            const server = await this.prisma.server.findUnique({
                where: {
                    id: serverId
                },
                include: {
                    channels: {
                        orderBy: {
                            createdAt: "asc"
                        }
                    },
                    members: {
                        include: {
                            user: true
                        },
                        orderBy: {
                            role: "asc"
                        }
                    }
                }
            })
            return server
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async fetchServerByUserId(userId: string){
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            const server = await this.prisma.server.findFirst({
                where:{
                    members:{
                        some: {
                            userId: userId
                        }
                    }
                }
            })
            if(!server) throw new HttpException('Server not found', HttpStatus.NOT_FOUND)
            return server
        } catch (error) {
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

    }
    async fetchServers (userId: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            const servers = await this.prisma.server.findMany({
                where: {
                    members: {
                        some: {
                            userId: userId
                        }
                    }
                }
            });
            return servers;
        } catch (error) {
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

    }

    async createServer(userId: string,serverData: ServerCreateInputType  ) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            const server = await this.prisma.server.create({
                data: {
                    userId: userId,
                    name: serverData.name,
                    image: serverData.image,
                    inviteCode: serverData.inviteCode || uuidv4(),
                    channels: {
                        create: [
                            {
                                name: "general",
                                userId: userId
                            }
                        ]
                    },
                    members: {
                        create: [
                            {
                                userId: userId,
                                role: MemberRole.ADMIN
                            }
                        ]
                    }
                }
            })
            return server
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
}
