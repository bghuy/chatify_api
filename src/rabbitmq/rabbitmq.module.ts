import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQConsumer } from './rabbitmq.consumer';
import { PrismaService } from './../prisma/prisma.service';

@Module({
  providers: [RabbitMQService,RabbitMQConsumer, PrismaService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
