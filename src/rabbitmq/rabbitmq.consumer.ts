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
    await this.channel.assertQueue('new_message_queue');
    this.channel.consume('new_message_queue', async (msg) => {

      if (msg) {
        const message = JSON.parse(msg.content.toString());
        console.log('Parsed message:', message);

        // Lưu tin nhắn vào database
        const newMessage = await this.prisma.message.create({
          data: {
            id: message?.id,
            content: message?.content,
            memberId: message?.memberId,
            channelId: message?.channelId,
            fileUrl: message?.fileUrl || null,
            createdAt: message?.createdAt || new Date(),
            updatedAt: message?.updatedAt || new Date(),
          },
        });
        console.log(newMessage,"newMessage");
        

        this.channel.ack(msg); // Xác nhận đã xử lý tin nhắn
      }

    });

    await this.channel.assertQueue('update_message_queue');
    this.channel.consume('update_message_queue', async (msg) => {

      if (msg) {
        const message = JSON.parse(msg.content.toString());
        console.log('Parsed updated message:', message);

        // Lưu tin nhắn vào database
        try {
          if(message?.deleted){
            console.log("run 1");
            
            const deletedMessage = await this.prisma.message.update({
              where: {
                  id: message?.id,
              },
              data: {
                  fileUrl: null,
                  content: "This message has been deleted",
                  deleted: true
              },
            })
          }
          else {
            console.log("run 2");
            
            const updatedMessage = await this.prisma.message.update({
              where: {
                id: message?.id,
              },
              data: {
                content: message?.content,
                updatedAt: message?.updatedAt,
              },
            })
          }
        } catch (error) {
          console.log(error);
        }
        this.channel.ack(msg); // Xác nhận đã xử lý tin nhắn
      }

    });
  }
}
