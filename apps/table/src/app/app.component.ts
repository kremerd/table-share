import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BoardItem } from '@table-share/api-interfaces';
import { Observable } from 'rxjs';
import { loadBoardItems, updateBoardItem } from './board-items/board-items.actions';
import { selectBoardItems } from './board-items/board-items.selectors';

@Component({
  selector: 'ts-root',
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

  boardItemTracker(index: number, boardItem: BoardItem): number {
    return boardItem.id;
  }

  updateBoardItem(boardItem: BoardItem): void {
    this.store.dispatch(updateBoardItem({ boardItem }));
  }
}
