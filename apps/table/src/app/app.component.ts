import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { BoardItem, Token } from '@table-share/api-interfaces';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { createBoardItem, loadBoardItems } from './board-items/board-items.actions';
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
  }

  boardItemTracker(index: number, boardItem: BoardItem): number {
    return boardItem.id;
  }

  addBoardItem(): void {
    this.openAddDialog().afterClosed().pipe(
      filter(result => result !== undefined),
      tap(tokens => tokens.forEach(token => this.store.dispatch(createBoardItem({ boardItem: token }))))
    ).subscribe();
  }

  private openAddDialog(): MatDialogRef<AddDialogComponent, Token[] | undefined> {
    const dialogConfig = {
      ariaLabel: 'Add tokens to the table',
      width: '600px',
      position: { top: '70px' }
    };
    return this.dialog.open(AddDialogComponent, dialogConfig);
  }
}
