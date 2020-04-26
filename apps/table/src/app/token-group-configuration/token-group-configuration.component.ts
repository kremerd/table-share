import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { TokenGroup } from '@table-share/api-interfaces';
import { removeByIndex, selectFormIfValid } from '@table-share/util';
import { Subject } from 'rxjs';
import { AddDialogContentMode } from '../add-dialog-content-mode';
import { verticalDeflation } from '../animations';
import { createTokens } from '../board-items/board-items.actions';

interface ComponentModel {
  form: FormArray;
}

@Component({
  selector: 'ts-token-group-configuration',
  templateUrl: './token-group-configuration.component.html',
  styleUrls: ['./token-group-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [verticalDeflation]
})
export class TokenGroupConfigurationComponent extends RxState<ComponentModel> {

  @Output()
  closeDialog = new EventEmitter<void>();

  @Output()
  switchContentMode = new EventEmitter<AddDialogContentMode>();

  private tokenGroups: TokenGroup[] = [
    { image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/English_pattern_jack_of_spades.svg', name: 'Jack', amount: 1 },
    { image: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/English_pattern_queen_of_spades.svg', name: 'Queen', amount: 2 },
    { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/English_pattern_king_of_spades.svg', name: 'King', amount: 3 }
  ];

  cancel = new Subject<void>();
  removeTokenAt = new Subject<number>();
  submitForm = new Subject<void>();

  constructor(private formBuilder: FormBuilder, private store: Store) {
    super();
    this.set({ form: this.buildForm(this.tokenGroups) });

    this.connect(this.removeTokenAt, (vm, index) => {
      const controls = removeByIndex(vm.form.controls, index);
      return { form: this.formBuilder.array(controls) };
    });

    const submitValidForm$ = this.submitForm.pipe(
      selectFormIfValid<TokenGroup[]>(() => this.get().form)
    );

    this.hold(this.cancel, () => this.switchContentMode.emit('token-upload'));
    this.hold(submitValidForm$, tokenGroups => this.store.dispatch(createTokens({ tokenGroups })));
    this.hold(submitValidForm$, () => this.closeDialog.emit());
  }

  private buildForm(tokenGroups: TokenGroup[]): FormArray {
    const formGroups = tokenGroups.map(token => this.buildFormGroup(token))
    return this.formBuilder.array(formGroups);
  }

  private buildFormGroup(token: TokenGroup): FormGroup {
    return this.formBuilder.group({
      image: [token.image],
      name: [token.name],
      amount: [token.amount, [Validators.min(0), Validators.max(16)]]
    });
  }

}
