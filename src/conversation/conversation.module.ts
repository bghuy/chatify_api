import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { PrismaModule } from './../prisma/prisma.module';
import { jwtStrategy } from './../auth/strategies/jwt.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [ConversationController],
  providers: [ConversationService, jwtStrategy]
})
export class ConversationModule {}
