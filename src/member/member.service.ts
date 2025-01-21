import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MemberRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorType } from 'src/utils/error';

@Injectable()
export class MemberService {

    constructor(private readonly prisma: PrismaService) {}

    async updateMemberRole(userId: string, memberId: string, serverId: string, role: MemberRole) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            if(!serverId) return new HttpException("Server ID is missing", HttpStatus.BAD_REQUEST);
            if(!memberId) return new HttpException("Member ID is missing", HttpStatus.BAD_REQUEST);
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    userId: userId
                },
                data: {
                    members: {
                        update: {
                            where: {
                                id:memberId,
                                userId: {
                                    not: userId
                                }
                            },
                            data: {
                                role
                            }
                        }
                    }
                },
                include: {
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
                            },
                        },
                        orderBy: {
                            role: "asc"
                        }
                    }
                }
            })
            return server

        } catch (error) {
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
    async deleteMember(userId: string, memberId: string, serverId: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!existingUser) throw new HttpException(ErrorType.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            if(!serverId) return new HttpException("Server ID is missing", HttpStatus.BAD_REQUEST);
            if(!memberId) return new HttpException("Member ID is missing", HttpStatus.BAD_REQUEST);
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    userId: userId
                },
                data: {
                    members: {
                        deleteMany: {
                            id: memberId,
                            userId: {
                                not: userId
                            }
                        }
                    }
                },
                include: {
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
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }


}
