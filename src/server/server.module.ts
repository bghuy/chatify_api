import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { jwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  controllers: [ServerController],
  providers: [ServerService, jwtStrategy]
})
export class ServerModule {}
