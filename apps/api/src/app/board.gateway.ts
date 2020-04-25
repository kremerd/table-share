import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { BoardItem } from '@table-share/api-interfaces';
import { generateRandomId, removeById, updateById } from '@table-share/util';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class BoardGateway {

  boardItems: BoardItem[] = [
    {
      type: 'token',
      id: generateRandomId(),
      name: 'Initial queen',
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/English_pattern_queen_of_spades.svg',
      x: 12,
      y: 42
    },
    {
      type: 'token',
      id: generateRandomId(),
      name: 'Initial king',
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/English_pattern_king_of_spades.svg',
      x: 52,
      y: 42
    }
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
    this.boardItems = updateById(this.boardItems, boardItem);
    client.broadcast.emit('boardItems', this.boardItems);
  }

  @SubscribeMessage('deleteBoardItem')
  onDeleteBoardItem(@ConnectedSocket() client: Socket, @MessageBody() boardItemId: number): void {
    this.boardItems = removeById(this.boardItems, boardItemId);
    client.broadcast.emit('boardItems', this.boardItems);
  }

}
