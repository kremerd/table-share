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
  sliderValue: number;
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
      map(scale => ({ scale, sliderValue: this.transformToSliderValue(scale) }))
    ));

    this.hold(this.sliderInput.pipe(
      throttleTime(10),
      tap(event => store.dispatch(setTokenGroupScale({ scale: this.transformToScale(event.value) })))
    ));

    this.hold(store.select(selectTokenGroups).pipe(
      filter(tokenGroups => tokenGroups.length === 0),
      delay(0),
      tap(() => this.backward.emit())
    ));
  }

  private transformToSliderValue(scale: number): number {
    return (Math.log(scale / 100) / 3 + 1) * 50;
  }

  private transformToScale(sliderValue: number | null): number {
    if (sliderValue === null) {
      return 100;
    }

    return Math.exp((sliderValue / 50 - 1) * 3) * 100;
  }

}
