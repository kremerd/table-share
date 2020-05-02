import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { TokenGroup } from '@table-share/api-interfaces';
import { ManagedFormArray, selectFormIfValid } from '@table-share/util';
import { Subject } from 'rxjs';
import { AddDialogContentMode } from '../add-dialog-content-mode';
import { addTokens, setTokenGroups } from '../add-tokens/add-tokens.actions';
import { selectAddTokenGroups } from '../add-tokens/add-tokens.selectors';
import { verticalDeflation } from '../animations';

@Component({
  selector: 'ts-token-group-configuration',
  templateUrl: './token-group-configuration.component.html',
  styleUrls: ['./token-group-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [verticalDeflation]
})
export class TokenGroupConfigurationComponent extends RxState<{}> {

  @Output()
  closeDialog = new EventEmitter<void>();

  @Output()
  switchContentMode = new EventEmitter<AddDialogContentMode>();

  cancel = new Subject<void>();
  removeTokenAt = new Subject<number>();
  submitForm = new Subject<void>();

  form = new ManagedFormArray<TokenGroup>(() => this.buildFormGroup());

  constructor(private formBuilder: FormBuilder, private store: Store) {
    super();

    const submitValidForm$ = this.submitForm.pipe(
      selectFormIfValid<TokenGroup[]>(() => this.form)
    );

    this.hold(this.form.valueChanges, (tokenGroups: TokenGroup[]) => this.store.dispatch(setTokenGroups({ tokenGroups })));
    this.hold(this.store.select(selectAddTokenGroups), tokenGroups => this.form.setValue(tokenGroups, { emitEvent: false }));
    this.hold(this.removeTokenAt, index => this.form.removeAt(index));

    this.hold(this.cancel, () => this.switchContentMode.emit('token-upload'));
    this.hold(submitValidForm$, tokenGroups => this.store.dispatch(addTokens({ tokenGroups })));
    this.hold(submitValidForm$, () => this.closeDialog.emit());
  }

  private buildFormGroup(): FormGroup {
    return this.formBuilder.group({
      image: '',
      name: '',
      amount: [0, [Validators.min(0), Validators.max(16)]]
    });
  }

}
