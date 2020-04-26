import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { MAX_FILE_SIZE } from '@table-share/api-interfaces';
import { Subject } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { AddDialogContentMode } from '../add-dialog-content-mode';
import { FileUploadService } from '../file-upload.service';

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

  constructor(fileUploadService: FileUploadService) {
    super();
    this.set({ form: new FormGroup({}) });

    const filesUploaded$ = this.filesSelected.pipe(
      filter(files => files.length > 0),
      mergeMap(files => fileUploadService.upload(files))
    );

    this.hold(this.cancel, () => this.closeDialog.emit());
    this.hold(filesUploaded$, () => this.switchContentMode.emit('token-group-configuration'));
  }

}
