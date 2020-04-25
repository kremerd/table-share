import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { BoardItem, Token } from '@table-share/api-interfaces';
import { Observable, Subject } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { createBoardItem, loadBoardItems } from './board-items/board-items.actions';
import { selectBoardItems } from './board-items/board-items.selectors';

interface ComponentModel {
  boardItems: BoardItem[];
}

@Component({
  selector: 'ts-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends RxState<ComponentModel> implements OnInit {

  addClick = new Subject<MouseEvent>();

  constructor(private dialog: MatDialog, private store: Store) {
    super();

    this.connect(store.pipe(
      select(selectBoardItems),
      map(boardItems => ({ boardItems }))
    ));

    this.hold(this.showModalOnAddClick(), boardItems => this.createBoardItems(boardItems));
  }

  private showModalOnAddClick(): Observable<BoardItem[]> {
    return this.addClick.pipe(
      map(() => this.openAddDialog()),
      mergeMap(dialog => dialog.afterClosed().pipe(filter(res => res !== undefined)))
    );
  }

  private openAddDialog(): MatDialogRef<AddDialogComponent, Token[] | undefined> {
    const dialogConfig = {
      ariaLabel: 'Add tokens to the table',
      width: '600px',
      position: { top: '70px' }
    };
    return this.dialog.open(AddDialogComponent, dialogConfig);
  }

  private createBoardItems(boardItems: BoardItem[]): void {
    for (const boardItem of boardItems) {
      this.store.dispatch(createBoardItem({ boardItem }));
    }
  }

  ngOnInit(): void {
    this.store.dispatch(loadBoardItems());
  }

  boardItemTracker(index: number, boardItem: BoardItem): number {
    return boardItem.id;
  }

}
