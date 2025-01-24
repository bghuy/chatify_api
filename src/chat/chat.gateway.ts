import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
  
  @WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly chatService: ChatService) {}
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('send_message')
    async handleMessage(client: Socket, payload: any) {
      console.log('Received message:', payload);
  
      // Phát lại tin nhắn tới tất cả người dùng
      this.server.emit('receive_message', payload);
  
      // Lưu tin nhắn vào RabbitMQ
      await this.chatService.sendMessageToQueue(payload);
    }
  }
  