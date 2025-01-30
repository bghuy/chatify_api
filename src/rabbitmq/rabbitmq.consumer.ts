import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RabbitMQConsumer implements OnModuleInit {
  private connection: Connection;
  private channel: Channel;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    this.connection = await connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    console.log('Connected to RabbitMQ for consuming');

    // Lắng nghe hàng đợi 'chat_queue'
    await this.channel.assertQueue('chat_queue');
    this.channel.consume('chat_queue', async (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        // console.log('Message received from amqp:', message);

        // Lưu tin nhắn vào database
        await this.prisma.message.create({
          data: {
            content: message?.content,
            memberId: message?.memberId,
            channelId: message?.channelId,
            fileUrl: message?.fileUrl || null,
            createdAt: message?.createdAt || new Date(),
            updatedAt: message?.updatedAt || new Date(),
          },
        });

        this.channel.ack(msg); // Xác nhận đã xử lý tin nhắn
      }
    });
  }
}
