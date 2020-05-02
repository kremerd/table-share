import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { delay, filter, map, tap } from 'rxjs/operators';
import { selectAddTokenGroups } from '../add-tokens/add-tokens.selectors';

export interface ComponentModel {
  image: string;
}

@Component({
  selector: 'ts-token-scaling',
  templateUrl: './token-scaling.component.html',
  styleUrls: ['./token-scaling.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenScalingComponent extends RxState<ComponentModel> {

  @Output()
  backward = new EventEmitter<void>();

  @Output()
  forward = new EventEmitter<void>();

  form = new FormGroup({
    scale: new FormControl(0)
  });

  constructor(store: Store) {
    super();

    const tokenGroups$ = store.select(selectAddTokenGroups)

    this.connect(tokenGroups$.pipe(
      map(tokenGroups => ({ image: tokenGroups[0]?.image }))
    ));

    this.hold(tokenGroups$.pipe(
      filter(tokenGroups => tokenGroups.length === 0),
      delay(0),
      tap(() => this.backward.emit())
    ));
  }

}
