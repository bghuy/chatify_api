import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import {v4 as uuidv4} from "uuid"
  @WebSocketGateway({ 
    cors: { 
      origin: [process.env.CLIENT_PRODUCTION_URL, process.env.CLIENT_DEVELOPMENT_URL],
      credentials: true, 
    }, 
    namespace: '/chat' 
  })
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
  
    @SubscribeMessage('new_message')
    async handleMessage(client: Socket, payload: any) {
      const id = uuidv4();
      // emit the message to all connected clients
      const {serverId,access_token, ...filteredPayload} = payload
      const memberId = filteredPayload?.member?.id;
      const channelId = filteredPayload?.channelId;
      const emittingPayload = {
        id,
        memberId,
        fileUrl: null,
        deleted: false,
        ...filteredPayload,
      }
      const channelKey = `chat:${channelId}:messages`;
      this.server.emit(channelKey, emittingPayload);
  
      // send the message to the queue
      await this.chatService.sendMessageToQueue(emittingPayload);
    }
  }
  