import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: Connection;
  private channel: Channel;

  async onModuleInit() {
    this.connection = await connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    console.log('Connected to RabbitMQ');
  }

  async sendMessage(queue: string, message: any) {
    await this.channel.assertQueue(queue);
    return this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }
}
