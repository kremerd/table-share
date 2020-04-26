import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { selectFormIfValid } from '@table-share/util';
import { Subject } from 'rxjs';
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
  submitForm = new Subject<void>();

  constructor() {
    super();
    this.set({ form: new FormGroup({}) });

    const submitValidForm$ = this.submitForm.pipe(
      selectFormIfValid<void>(() => this.get().form)
    );

    this.hold(this.cancel, () => this.closeDialog.emit());
    this.hold(submitValidForm$, () => this.switchContentMode.emit('token-group-configuration'));
  }

}
