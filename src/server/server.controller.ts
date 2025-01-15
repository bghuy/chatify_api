import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from './../guards/jwt.guard';
import { ErrorType } from './../utils/error';
import { ServerService } from './server.service';
import { AuthenticatedUserType } from './../utils/types/auth';
import { ServerCreateDto } from './../dtos/server/ServerCreate.dto';

@Controller('server')
export class ServerController {
    constructor(private  readonly serverService: ServerService) {}

    @Get('/all')
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
            return this.serverService.createServer(userId, newServerData);
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
