import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardItem } from '@table-share/api-interfaces';

@Component({
  selector: 'ts-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {

  constructor() { }

  @Input()
  token: BoardItem;

  @Output()
  tokenUpdated: EventEmitter<BoardItem> = new EventEmitter();

  dragged: boolean = false;

  ngOnInit(): void {
  }

  onDragStarted(event: CdkDragStart): void {
    this.dragged = true;
  }

  onDragEnd(event: CdkDragEnd): void {
    this.dragged = false;
    const { x, y } = event.source.getFreeDragPosition();
    this.tokenUpdated.emit({ ...this.token, x, y });
  }

}
