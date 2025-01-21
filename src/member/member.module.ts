import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { jwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [MemberController],
  providers: [MemberService, jwtStrategy]
})
export class MemberModule {}
