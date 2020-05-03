import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { BoardItem } from '@table-share/api-interfaces';
import { map } from 'rxjs/operators';
import { selectBoardItems } from '../board-items/board-items.selectors';

interface ComponentModel {
  boardItems: BoardItem[];
}

@Component({
  selector: 'ts-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent extends RxState<ComponentModel> {

  constructor(store: Store) {
    super();

    this.connect(store.pipe(
      select(selectBoardItems),
      map(boardItems => ({ boardItems }))
    ));
  }

  boardItemTracker(index: number, boardItem: BoardItem): number {
    return boardItem.id;
  }

}
