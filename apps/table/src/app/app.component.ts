import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { loadBoardItems } from './board-items/board-items.actions';


@Component({
  selector: 'ts-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends RxState<{}> implements OnInit {

  resetNavigation = new Subject<void>();
  addBoardItem = new Subject<void>();

  constructor(private dialog: MatDialog, private store: Store) {
    super();

    this.hold(this.addBoardItem, () => this.openAddDialog());
  }

  private openAddDialog(): MatDialogRef<AddDialogComponent> {
    const dialogConfig: MatDialogConfig = {
      ariaLabel: 'Add tokens to the table',
      disableClose: true,
      position: { top: '70px' },
      width: '600px'
    };
    return this.dialog.open(AddDialogComponent, dialogConfig);
  }

  ngOnInit(): void {
    this.store.dispatch(loadBoardItems());
  }

}
