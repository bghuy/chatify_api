import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { ServerRoles } from "./../decorators/sever-role.decorator";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class ServerRoleGuard implements CanActivate{
    constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const roles = this.reflector.get<string[]>(ServerRoles, context.getHandler());
            if(!roles) return true;
    
            const request = context.switchToHttp().getRequest<Request>();
            const memberId = request.params.memberId;
            const serverId = request.query.serverId as string;
            if(!memberId) {
                throw new HttpException('Member Id is required', HttpStatus.BAD_REQUEST);
            }
            if(!serverId) {
                throw new HttpException('Server Id is required', HttpStatus.BAD_REQUEST);
            }
            const user = request.user as { role: string, id: string };
            if(!user || !user.id) {
                return false;
            }
            const MemberInServer = await this.prisma.member.findFirst({
                where: {
                    userId: user.id,
                    serverId,
                },
            });
            
            if (!MemberInServer || !MemberInServer?.role) {
                return false;
            }
            const hasRole = roles.includes(MemberInServer.role);
            return hasRole;
        } catch (error) {
            throw error
        }
    }}