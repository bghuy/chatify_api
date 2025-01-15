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

    @Get(':userId')
    @UseGuards(JwtGuard)
    async getServerByUserId(@Param('userId') userId: string, @Req() req: Request) {
        try {
            if(userId && (req.user as AuthenticatedUserType)?.id && userId !== (req.user as AuthenticatedUserType).id) {
                throw new HttpException('Forbidden: You are not allowed to access this resource', HttpStatus.FORBIDDEN);
            }
            const server = await this.serverService.fetchServerByUserId(userId);
            return { message: 'Server is found', data: {server} }
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
    @Get('/all')
    @UseGuards(JwtGuard)
    async getServers(@Req() req: Request) {
        try {
            // if(userId && (req.user as AuthenticatedUserType)?.id && userId !== (req.user as AuthenticatedUserType).id) {
            //     throw new HttpException('Forbidden: You are not allowed to access this resource', HttpStatus.FORBIDDEN);
            // }
            // const server = await this.serverService.fetchServerByUserId(userId);
            // return { message: 'Server is found', data: {server} }
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
