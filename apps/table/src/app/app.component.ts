import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { BoardItem, Token } from '@table-share/api-interfaces';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { loadBoardItems } from './board-items/board-items.actions';
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

    this.hold(this.addClick, () => this.openAddDialog());
  }

  private openAddDialog(): MatDialogRef<AddDialogComponent, Token[] | undefined> {
    const dialogConfig = {
      ariaLabel: 'Add tokens to the table',
      width: '600px',
      position: { top: '70px' }
    };
    return this.dialog.open(AddDialogComponent, dialogConfig);
  }

  ngOnInit(): void {
    this.store.dispatch(loadBoardItems());
  }

  boardItemTracker(index: number, boardItem: BoardItem): number {
    return boardItem.id;
  }

}
