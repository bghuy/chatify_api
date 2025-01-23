import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
@WebSocketGateway({
    cors: {
        origin: [process.env.CLIENT_PRODUCTION_URL, process.env.CLIENT_DEVELOPMENT_URL],
        credentials: true,
    },
})
export class Gateway
{
    @WebSocketServer()
    server: Server
    
    handleConnection(client: Socket): void {
        console.log(client.id,":connected");
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log(body);
        this.server.emit('onMessage', {
            msg: "new message",
            content: body
        });
    }

     handleDisconnect(client: Socket): void {
        console.log(client.id,":disconnected");
    }

}