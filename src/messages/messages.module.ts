import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaModule } from './../prisma/prisma.module';
import { jwtStrategy } from './../auth/strategies/jwt.strategy';

@Module({
  imports: [PrismaModule],
  providers: [MessagesService,jwtStrategy],
  controllers: [MessagesController]
})
export class MessagesModule {}
