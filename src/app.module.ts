import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServerModule } from './server/server.module';
import { MemberModule } from './member/member.module';
import { ChannelModule } from './channel/channel.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ServerModule,
    MemberModule,
    ChannelModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
