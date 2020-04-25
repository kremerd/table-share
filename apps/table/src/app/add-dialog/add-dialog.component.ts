import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RxState } from '@rx-angular/state';
import { Token } from '@table-share/api-interfaces';
import { generateRandomId, removeByIndex } from '@table-share/util';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { verticalDeflation } from '../animations';
import { TokenEssentials, TokenGroup } from './token-group';

interface ComponentModel {
  form: FormArray;
}

@Component({
  selector: 'ts-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [verticalDeflation]
})
export class AddDialogComponent extends RxState<ComponentModel> {

  private tokenGroups: TokenGroup[] = [
    { image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/English_pattern_jack_of_spades.svg', name: 'Jack', amount: 1 },
    { image: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/English_pattern_queen_of_spades.svg', name: 'Queen', amount: 2 },
    { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/English_pattern_king_of_spades.svg', name: 'King', amount: 3 }
  ];

  removeTokenAt = new Subject<number>();
  submitForm = new Subject<void>();

  constructor(
    private dialog: MatDialogRef<AddDialogComponent, Token[] | undefined>,
    private formBuilder: FormBuilder
  ) {
    super();
    this.set({ form: this.buildForm(this.tokenGroups) });

    this.connect(this.removeTokenAt, (vm, index) => {
      const controls = removeByIndex(vm.form.controls, index);
      return { form: this.formBuilder.array(controls) };
    });

    const submitValidForm$ = this.submitForm.pipe(
      map(() => this.get().form),
      filter(form => form.valid),
      map(form => this.generateTokens(form.value))
    );

    this.hold(submitValidForm$, tokens => this.dialog.close(tokens));
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

  private generateTokens(tokenGroups: TokenGroup[]): Token[] {
    return tokenGroups
      .map(({ name, image, amount }) => Array<TokenEssentials>(amount).fill({ name, image }))
      .flat()
      .map((essentials, i) => ({
        type: 'token',
        id: generateRandomId(),
        x: 30 * i,
        y: 30 * i,
        ...essentials
      }));
  }

}
