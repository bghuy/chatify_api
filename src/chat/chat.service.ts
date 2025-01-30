import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class ChatService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async sendMessageToQueue(message: any) {
    await this.rabbitMQService.sendMessage('chat_queue', message);
  }  
}
