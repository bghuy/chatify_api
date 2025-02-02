import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MemberRole, Prisma } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { ErrorType } from './../utils/error';
import { ServerCreateInputType, ServerUpdateInputType } from './../utils/types/server';
import {v4 as uuidv4} from "uuid"
@Injectable()
export class ServerService {
    constructor(private readonly prisma: PrismaService) { }

    async fetchCurrentMemberInServer(userId: string,serverId: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            if(!serverId) throw new HttpException("serverId is missing", HttpStatus.BAD_REQUEST);
            const member = await this.prisma.member.findFirst({
                where: {
                    serverId: serverId,
                    userId: userId
                },
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
            });
            return member
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async fetchServerById(serverId: string, channelName?: string) {
        if(!serverId) throw new HttpException("serverId is missing", HttpStatus.BAD_REQUEST);
        try {
            const server = await this.prisma.server.findUnique({
                where: {
                    id: serverId
                },
                include: {
                    channels: {
                        where: channelName ? { name: channelName } : undefined,
                        orderBy: {
                            createdAt: "asc"
                        }
                    },
                    members: {
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

    async deleteServer(userId: string ,serverId: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            const server = await this.prisma.server.delete({
                where: {
                    id: serverId,
                    userId: userId
                }, 
            })
            return server
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateServer (userId: string, serverId: string, serverData: ServerUpdateInputType) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    userId: userId
                },
                data: {
                    name: serverData.name,
                    image: serverData.image
                }
            })
            return server
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createNewServerInviteCode(userId: string, serverId: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    userId: userId
                },
                data: {
                    inviteCode: uuidv4()
                }
            }); 
            return server
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async leaveServer(userId: string, serverId: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            if(!serverId) throw new HttpException("Server ID is missing", HttpStatus.BAD_REQUEST)
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    userId: {
                        not: userId
                    },
                    members: {
                        some: {
                            userId: userId
                        }
                    }
                },
                data: {
                    members: {
                        deleteMany: {
                            userId: userId
                        }
                    }
                }
    
            }) 
            return server
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async joinServer(userId: string, inviteCode: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            const existingServer = await this.prisma.server.findFirst({
                where: {
                    inviteCode: inviteCode,
                    members: {
                        some: {
                            userId: userId
                        }
                    }
                }
            })
            if(existingServer) throw new HttpException('User is already a member of the server', HttpStatus.CONFLICT);
            const server = await this.prisma.server.update({
                where: {
                    inviteCode: inviteCode,
                },
                data: {
                    members: {
                        create: [
                            {
                                userId: userId
                            }
                        ]
                    }
                }
            })
            
            return server
        } catch (error) {
            console.log(error,'error');
            
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }


    }
}
