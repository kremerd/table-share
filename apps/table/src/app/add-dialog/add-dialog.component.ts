import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { AddDialogContentMode } from '../add-dialog-content-mode';
import { resetTokenCreation } from '../add-tokens/add-tokens.actions';

interface ComponentModel {
  contentMode: AddDialogContentMode;
}

@Component({
  selector: 'ts-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDialogComponent extends RxState<ComponentModel> {

  closeDialog = new Subject<void>();
  switchContentMode = new Subject<AddDialogContentMode>();

  constructor(dialog: MatDialogRef<AddDialogComponent>, store: Store) {
    super();
    this.set({ contentMode: 'token-upload' });
    store.dispatch(resetTokenCreation());

    this.connect(this.switchContentMode, (_, contentMode) => ({ contentMode }));

    this.hold(this.closeDialog, () => dialog.close());
  }

}
