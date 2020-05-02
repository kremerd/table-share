import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { delay, filter, map, tap, throttleTime } from 'rxjs/operators';
import { setTokenGroupScale } from '../add-tokens/add-tokens.actions';
import { selectTokenGroups, selectTokenGroupScale } from '../add-tokens/add-tokens.selectors';

export interface ComponentModel {
  image: string;
  scale: number;
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

  sliderInput = new Subject<MatSliderChange>();

  constructor(store: Store) {
    super();

    this.connect(store.select(selectTokenGroups).pipe(
      map(tokenGroups => ({ image: tokenGroups[0]?.image }))
    ));

    this.connect(store.select(selectTokenGroupScale).pipe(
      map(scale => ({ scale }))
    ));

    this.hold(this.sliderInput.pipe(
      throttleTime(10),
      tap(event => store.dispatch(setTokenGroupScale({ scale: event.value ?? 100 })))
    ));

    this.hold(store.select(selectTokenGroups).pipe(
      filter(tokenGroups => tokenGroups.length === 0),
      delay(0),
      tap(() => this.backward.emit())
    ));
  }

}
