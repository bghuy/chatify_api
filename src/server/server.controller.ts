import { Controller, Get, HttpException, HttpStatus, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ErrorType } from 'src/utils/error';
import { ServerService } from './server.service';
import { AuthenticatedUserType } from 'src/utils/types/auth';

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
            return this.serverService.fetchServerByUserId(userId);
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
