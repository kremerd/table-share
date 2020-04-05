import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { BoardItem } from '@table-share/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Component({
  selector: 'table-share-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private socket: Socket
  ) {}

  boardItems$: Observable<BoardItem[]>;

  ngOnInit(): void {
    this.boardItems$ = this.socket.fromEvent<BoardItem[]>('boardItems');
    this.socket.emit('getBoardItems');
  }

  drop(boardItem: BoardItem, event: CdkDragEnd<void>): void {
    const { x, y } = event.source.getFreeDragPosition();
    this.socket.emit('updateBoardItem', { ...boardItem, x, y });
  }
}
