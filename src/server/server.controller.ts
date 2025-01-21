import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from './../guards/jwt.guard';
import { ErrorType } from './../utils/error';
import { ServerService } from './server.service';
import { AuthenticatedUserType } from './../utils/types/auth';
import { ServerCreateDto, ServerUpdateDto } from './../dtos/server/ServerCreate.dto';

@Controller('server')
export class ServerController {
    constructor(private  readonly serverService: ServerService) {}

    @Get('all')
    @UseGuards(JwtGuard)
    async getServers(@Req() req: Request) {
        console.log("all");
        
        try {
            const servers = await this.serverService.fetchServers((req.user as AuthenticatedUserType)?.id);
            return { message: 'Servers found', data: {servers} }
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

    @Get(':serverId')
    @UseGuards(JwtGuard)
    async getServerById(@Param('serverId') serverId: string,@Req() req: Request) {
        console.log("id");
        
        try {
            const server = await this.serverService.fetchServerById(serverId);
            return { message: 'Server found', data: {server} }
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

    @Get()
    @UseGuards(JwtGuard)
    async getServerByUserId(@Req() req: Request) {
        try {
            const server = await this.serverService.fetchServerByUserId((req.user as AuthenticatedUserType)?.id);
            return { message: 'Server found', data: {server} }
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
    async createServer(@Body() newServerData: ServerCreateDto, @Req() req: Request) {
        try {
            const userId = (req.user as AuthenticatedUserType)?.id;
            const server = await this.serverService.createServer(userId, newServerData);
            return { message: 'Server found', data: {server} }
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

    @Delete(':serverId')
    @UseGuards(JwtGuard)
    async deleteServer(@Param('serverId') serverId: string, @Req() req: Request) {
        try {
            if(!serverId) throw new HttpException('serverId is missing', HttpStatus.BAD_REQUEST)
            const userId = (req.user as AuthenticatedUserType)?.id;
            const server = await this.serverService.deleteServer(userId,serverId)
            return { message: 'Server deleted', data: {server} }
        }
        catch(error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Patch(':serverId/invite-code')
    @UseGuards(JwtGuard)
    async generateNewServerInviteCode(@Param('serverId') serverId: string, @Req() req: Request) {
        try {
            if(!serverId) throw new HttpException('serverId is missing', HttpStatus.BAD_REQUEST)
            const userId = (req.user as AuthenticatedUserType)?.id;
            const server = await this.serverService.createNewServerInviteCode(userId,serverId)
            return { message: 'Invite code updated', data: {server} }
        }
        catch(error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Patch('join-server')
    @UseGuards(JwtGuard)
    async joinServer(@Body('inviteCode') inviteCode: string,  @Req() req: Request) {
        try {
            if(!inviteCode) throw new HttpException('inviteCode is missing', HttpStatus.BAD_REQUEST)
            const userId = (req.user as AuthenticatedUserType)?.id;
            const server = await this.serverService.joinServer(userId,inviteCode)
            console.log(server);
            return { message: 'Server joined', data: {server} }
        }
        catch(error) {
            
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    


    @Patch(':serverId')
    @UseGuards(JwtGuard)
    async updateServer(@Param('serverId') serverId: string, @Body() serverData: ServerUpdateDto, @Req() req: Request) {
        try {
            if(!serverId) throw new HttpException('serverId is missing', HttpStatus.BAD_REQUEST)
            const userId = (req.user as AuthenticatedUserType)?.id;
            const server = await this.serverService.updateServer(userId,serverId,serverData)
            return { message: 'Server updated', data: {server} }
        }
        catch(error) {
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
