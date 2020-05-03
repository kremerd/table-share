import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { map, switchMapTo, take, tap } from 'rxjs/operators';
import { AddDialogContentMode } from '../add-dialog-content-mode';
import { addTokens, resetTokenCreation } from '../add-tokens/add-tokens.actions';
import { selectAddTokens } from '../add-tokens/add-tokens.selectors';

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

  cancel = new Subject<void>();
  switchContentMode = new Subject<AddDialogContentMode>();
  complete = new Subject<void>();

  constructor(dialog: MatDialogRef<AddDialogComponent>, store: Store) {
    super();
    this.set({ contentMode: 'token-upload' });
    store.dispatch(resetTokenCreation());

    this.connect(this.switchContentMode.pipe(
      map(contentMode => ({ contentMode }))
    ));

    this.hold(this.cancel.pipe(
      tap(() => dialog.close())
    ));

    this.hold(this.complete.pipe(
      switchMapTo(store.select(selectAddTokens).pipe(take(1))),
      tap(({ scale, tokenGroups }) => {
        store.dispatch(addTokens({ scale, tokenGroups }));
        dialog.close();
      })
    ));
  }

}
