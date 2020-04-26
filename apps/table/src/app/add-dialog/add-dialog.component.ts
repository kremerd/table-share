import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { AddDialogContentMode } from '../add-dialog-content-mode';

interface ComponentModel {
  contentMode: 'token-upload' | 'token-group-configuration';
}

@Component({
  selector: 'ts-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDialogComponent extends RxState<ComponentModel> {

  closeDialog = new Subject<void>();
  switchContentMode = new Subject<AddDialogContentMode>();;

  constructor(private dialog: MatDialogRef<AddDialogComponent>) {
    super();
    this.set({ contentMode: 'token-upload' });

    this.connect(this.switchContentMode, (_, contentMode) => ({ contentMode }));

    this.hold(this.closeDialog, () => this.dialog.close());
  }

}
