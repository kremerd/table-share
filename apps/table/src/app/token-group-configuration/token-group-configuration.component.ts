import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { TokenGroup } from '@table-share/api-interfaces';
import { ManagedFormArray, selectFormIfValid } from '@table-share/util';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
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
  backward = new EventEmitter<void>();

  @Output()
  forward = new EventEmitter<void>();

  removeTokenAt = new Subject<number>();
  submitForm = new Subject<void>();

  form = new ManagedFormArray<TokenGroup>(() => this.buildFormGroup());

  constructor(private formBuilder: FormBuilder, private store: Store) {
    super();

    this.hold(this.form.valueChanges, (tokenGroups: TokenGroup[]) => this.store.dispatch(setTokenGroups({ tokenGroups })));
    this.hold(this.store.select(selectAddTokenGroups), tokenGroups => this.form.setValue(tokenGroups, { emitEvent: false }));

    this.hold(this.removeTokenAt.pipe(
      tap(index => this.form.removeAt(index)),
      filter(() => this.form.length === 0),
      tap(() => this.backward.emit())
    ));

    this.hold(this.submitForm.pipe(
      selectFormIfValid<TokenGroup[]>(() => this.form),
      tap(tokenGroups => this.store.dispatch(addTokens({ tokenGroups }))),
      tap(() => this.forward.emit())
    ));
  }

  private buildFormGroup(): FormGroup {
    return this.formBuilder.group({
      image: '',
      name: '',
      amount: [0, [Validators.min(0), Validators.max(16)]]
    });
  }

}
