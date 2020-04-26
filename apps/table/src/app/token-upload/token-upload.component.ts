import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AddDialogContentMode } from '../add-dialog-content-mode';

interface ComponentModel {
  form: FormGroup;
}

@Component({
  selector: 'ts-token-upload',
  templateUrl: './token-upload.component.html',
  styleUrls: ['./token-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenUploadComponent extends RxState<ComponentModel> {

  @Output()
  closeDialog = new EventEmitter<void>();

  @Output()
  switchContentMode = new EventEmitter<AddDialogContentMode>();

  cancel = new Subject<void>();
  filesSelected = new Subject<File[]>();

  readonly MAX_FILE_SIZE = 10 * 1024 * 1024;

  constructor() {
    super();
    this.set({ form: new FormGroup({}) });

    const actualFilesSelected$ = this.filesSelected.pipe(filter(files => files.length > 0));

    this.hold(this.cancel, () => this.closeDialog.emit());
    this.hold(actualFilesSelected$, () => this.switchContentMode.emit('token-group-configuration'));
  }

}
