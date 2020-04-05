import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Message } from '@table-share/api-interfaces';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway {

  @SubscribeMessage('message')
  onChat(client: Socket, message: Message): void {
    client.broadcast.emit('message', message);
  }

}
