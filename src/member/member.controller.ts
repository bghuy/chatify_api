import { Body, Controller, HttpException, HttpStatus, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ErrorType } from 'src/utils/error';
import { MemberService } from './member.service';
import { Request } from 'express';
import { AuthenticatedUserType } from 'src/utils/types/auth';
import { MemberRole } from '@prisma/client';
import { ServerRoles } from 'src/decorators/sever-role.decorator';
import { ServerRoleGuard } from 'src/guards/server-role.guard';

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
}
