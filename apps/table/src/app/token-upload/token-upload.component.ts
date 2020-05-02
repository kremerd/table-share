import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { MAX_FILE_SIZE } from '@table-share/api-interfaces';
import { Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { addTokenImages } from '../add-tokens/add-tokens.actions';
import { selectTokenGroups, selectTokenUploadInProgress } from '../add-tokens/add-tokens.selectors';

export interface ComponentModel {
  disableProceed: boolean;
}

@Component({
  selector: 'ts-token-upload',
  templateUrl: './token-upload.component.html',
  styleUrls: ['./token-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenUploadComponent extends RxState<ComponentModel> {

  @Output()
  backward = new EventEmitter<void>();

  @Output()
  forward = new EventEmitter<void>();

  filesSelected = new Subject<File[]>();

  readonly MAX_FILE_SIZE = MAX_FILE_SIZE;

  constructor(store: Store) {
    super();

    this.connect(store.select(selectTokenGroups).pipe(
      map(tokenGroups => ({ disableProceed: tokenGroups.length === 0 }))
    ))

    this.hold(this.filesSelected.pipe(
      filter(files => files.length > 0),
      tap(files => store.dispatch(addTokenImages({ images: files })))
    ));

    this.hold(store.select(selectTokenUploadInProgress).pipe(
      filter(inProgress => inProgress === false),
      tap(() => this.forward.emit())
    ));
  }

}
