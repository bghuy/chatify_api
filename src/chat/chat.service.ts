import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class ChatService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async sendMessageToQueue(message: any) {
    await this.rabbitMQService.sendMessage('new_message_queue', message);
  }  
  async sendUpdatedMessageToQueue(message: any) {
    await this.rabbitMQService.sendMessage('update_message_queue', message);
  } 
}
