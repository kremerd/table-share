import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { BoardItem, generateRandomId } from '@table-share/api-interfaces';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class BoardGateway {

  items: BoardItem[] = [
    { id: generateRandomId(), type: 'card', x: 12, y: 42 }
  ];

  @SubscribeMessage('getBoardItems')
  onBoardItems(): WsResponse<BoardItem[]> {
    return { event: 'boardItems', data: this.items }
  }

  @SubscribeMessage('updateBoardItems')
  onUpdateBoardItems(@ConnectedSocket() client: Socket, @MessageBody() items: BoardItem[]): void {
    this.items = items;
    client.broadcast.emit('boardItems', items);
  }

}
