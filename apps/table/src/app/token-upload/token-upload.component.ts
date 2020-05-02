import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { MAX_FILE_SIZE } from '@table-share/api-interfaces';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AddDialogContentMode } from '../add-dialog-content-mode';
import { addTokenImages } from '../add-tokens/add-tokens.actions';
import { selectAddTokenUploadInProgress } from '../add-tokens/add-tokens.selectors';

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

  readonly MAX_FILE_SIZE = MAX_FILE_SIZE;

  constructor(store: Store) {
    super();
    this.set({ form: new FormGroup({}) });

    const filesReadyToUpload$ = this.filesSelected.pipe(
      filter(files => files.length > 0)
    );

    const filesUploaded$ = store.select(selectAddTokenUploadInProgress).pipe(
      filter(inProgress => inProgress === false)
    )

    this.hold(this.cancel, () => this.closeDialog.emit());
    this.hold(filesReadyToUpload$, files => store.dispatch(addTokenImages({ images: files })));
    this.hold(filesUploaded$, () => this.switchContentMode.emit('token-group-configuration'));
  }

}
