import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { BoardItem } from '@table-share/api-interfaces';
import { removeById, updateById } from '@table-share/util';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class BoardGateway {

  boardItems: BoardItem[] = [];

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
    this.boardItems = updateById(this.boardItems, boardItem);
    client.broadcast.emit('boardItems', this.boardItems);
  }

  @SubscribeMessage('deleteBoardItem')
  onDeleteBoardItem(@ConnectedSocket() client: Socket, @MessageBody() boardItemId: number): void {
    this.boardItems = removeById(this.boardItems, boardItemId);
    client.broadcast.emit('boardItems', this.boardItems);
  }

}
