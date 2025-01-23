import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { PrismaModule } from './../prisma/prisma.module';
import { jwtStrategy } from './../auth/strategies/jwt.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [ChannelController],
  providers: [ChannelService, jwtStrategy]
})
export class ChannelModule {}
