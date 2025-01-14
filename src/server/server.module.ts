import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { jwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServerController],
  providers: [ServerService, jwtStrategy]
})
export class ServerModule {}
