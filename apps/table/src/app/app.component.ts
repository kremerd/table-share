import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BoardItem } from '@table-share/api-interfaces';
import { Observable } from 'rxjs';
import { loadBoardItems, updateBoardItem } from './board-items/board-items.actions';
import { selectBoardItems } from './board-items/board-items.selectors';

@Component({
  selector: 'table-share-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store
  ) {}

  boardItems$: Observable<BoardItem[]>;

  ngOnInit(): void {
    this.boardItems$ = this.store.pipe(select(selectBoardItems));
    this.store.dispatch(loadBoardItems());
  }

  onDragEnd(boardItem: BoardItem, event: CdkDragEnd<void>): void {
    const { x, y } = event.source.getFreeDragPosition();
    this.store.dispatch(updateBoardItem({ boardItem: { ...boardItem, x, y } }));
  }
}
