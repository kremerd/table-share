import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { BoardItem } from '@table-share/api-interfaces';
import { Observable } from 'rxjs';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { loadBoardItems, updateBoardItem } from './board-items/board-items.actions';
import { selectBoardItems } from './board-items/board-items.selectors';

@Component({
  selector: 'ts-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private store: Store
  ) {}

  boardItems$: Observable<BoardItem[]>;

  ngOnInit(): void {
    this.boardItems$ = this.store.pipe(select(selectBoardItems));
    this.store.dispatch(loadBoardItems());
    this.dialog.open(AddDialogComponent, { ariaLabel: 'Add tokens to the table', width: '600px', position: { top: '70px' } });
  }

  boardItemTracker(index: number, boardItem: BoardItem): number {
    return boardItem.id;
  }

  addBoardItem(): void {
    this.dialog.open(AddDialogComponent, { ariaLabel: 'Add tokens to the table', width: '600px' });
  }

  updateBoardItem(boardItem: BoardItem): void {
    this.store.dispatch(updateBoardItem({ boardItem }));
  }
}
