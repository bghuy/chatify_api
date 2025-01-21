import { Body, Controller, Delete, HttpException, HttpStatus, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from './../guards/jwt.guard';
import { ErrorType } from './../utils/error';
import { MemberService } from './member.service';
import { Request } from 'express';
import { AuthenticatedUserType } from './../utils/types/auth';
import { MemberRole } from '@prisma/client';
import { ServerRoles } from './../decorators/sever-role.decorator';
import { ServerRoleGuard } from './../guards/server-role.guard';

@Controller('member')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Patch(':memberId')
    @ServerRoles(['ADMIN'])
    @UseGuards(JwtGuard,ServerRoleGuard)
    async getMember(
        @Param('memberId') memberId: string,
        @Query('serverId') serverId: string,
        @Body('role') role: MemberRole,
        @Req() req: Request
    ) {
        try {
            const server = await this.memberService.updateMemberRole((req.user as AuthenticatedUserType)?.id, memberId, serverId, role);
            return { message: 'Role updated', data: {server} }
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


    @Delete(':memberId')
    @ServerRoles(['ADMIN'])
    @UseGuards(JwtGuard,ServerRoleGuard)
    async deleteMember(
        @Param('memberId') memberId: string,
        @Query('serverId') serverId: string,
        @Req() req: Request
    ) {
        try {
            const server = await this.memberService.deleteMember((req.user as AuthenticatedUserType)?.id, memberId, serverId);
            return { message: 'Member deleted', data: {server} }
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
