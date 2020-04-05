import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { BoardItem, generateRandomId } from '@table-share/api-interfaces';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class BoardGateway {

  boardItems: BoardItem[] = [
    { id: generateRandomId(), type: 'card', x: 12, y: 42 },
    { id: generateRandomId(), type: 'card', x: 52, y: 42 }
  ];

  @SubscribeMessage('getBoardItems')
  onBoardItems(): WsResponse<BoardItem[]> {
    return { event: 'boardItems', data: this.boardItems }
  }

  @SubscribeMessage('createBoardItem')
  onCreateBoardItem(@ConnectedSocket() client: Socket, @MessageBody() boardItem: BoardItem): void {
    this.boardItems = [...this.boardItems, boardItem];
    client.broadcast.emit('boardItems', this.boardItems);
  }

  @SubscribeMessage('updateBoardItem')
  onUpdateBoardItem(@ConnectedSocket() client: Socket, @MessageBody() boardItem: BoardItem): void {
    const index = this.boardItems.findIndex(item => item.id === boardItem.id);
    this.boardItems = [...this.boardItems.slice(0, index), boardItem, ...this.boardItems.slice(index + 1)]
    client.broadcast.emit('boardItems', this.boardItems);
  }

  @SubscribeMessage('deleteBoardItem')
  onDeleteBoardItem(@ConnectedSocket() client: Socket, @MessageBody() boardItemId: number): void {
    const index = this.boardItems.findIndex(item => item.id === boardItemId);
    this.boardItems = [...this.boardItems.slice(0, index), ...this.boardItems.slice(index + 1)]
    client.broadcast.emit('boardItems', this.boardItems);
  }

}
