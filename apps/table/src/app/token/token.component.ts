import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { Token } from '@table-share/api-interfaces';
import { Subject } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { updateBoardItem } from '../board-items/board-items.actions';

interface ComponentModel {
  token: Token;
  dragged: boolean;
}

@Component({
  selector: 'ts-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent extends RxState<ComponentModel> {

  // TODO: Make observable
  @Input()
  set token(token: Token) {
    this.set({ token });
  }

  dragStart = new Subject<CdkDragStart>();
  dragEnd = new Subject<CdkDragEnd>();

  constructor(store: Store) {
    super();
    this.set({ dragged: false });

    this.connect(this.dragStart, () => ({ dragged: true }));
    this.connect(this.dragEnd, () => ({ dragged: false }));

    this.hold(this.dragEnd.pipe(withLatestFrom(this.$)), ([event, vm]) => {
      const { x, y } = event.source.getFreeDragPosition();
      const boardItem = { ...vm.token, x, y };
      store.dispatch(updateBoardItem({ boardItem }));
    });
  }

}
