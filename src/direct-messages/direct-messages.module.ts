import { Module } from '@nestjs/common';
import { DirectMessagesController } from './direct-messages.controller';
import { DirectMessagesService } from './direct-messages.service';
import { PrismaModule } from './../prisma/prisma.module';
import { jwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [DirectMessagesController],
  providers: [DirectMessagesService, jwtStrategy]
})
export class DirectMessagesModule {}
