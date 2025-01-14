import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServerService {
    constructor(private readonly prisma: PrismaService) { }
    async fetchServerByUserId(userId: string){
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
    }
}
