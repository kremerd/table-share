import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { BoardItem } from '@table-share/api-interfaces';
import { Subject } from 'rxjs';
import { filter, map, mapTo, tap } from 'rxjs/operators';
import { selectBoardItems } from '../board-items/board-items.selectors';

interface ComponentModel {
  boardItems: BoardItem[];
  translation: { x: number, y: number };
  moveInProgress: { x: number, y: number } | null;
}

@Component({
  selector: 'ts-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent extends RxState<ComponentModel> {

  mouseDown = new Subject<MouseEvent>();
  mouseMove = new Subject<MouseEvent>();
  mouseUp = new Subject<MouseEvent>();
  contextMenu = new Subject<Event>();

  constructor(store: Store) {
    super();
    this.set({ translation: { x: 0, y: 0 } });

    this.connect(store.pipe(
      select(selectBoardItems),
      map(boardItems => ({ boardItems }))
    ));

    this.connect(this.mouseDown.pipe(
      filter(event => event.button === 2),
      map(event => ({ moveInProgress: { x: event.x, y: event.y } }))
    ));

    this.connect(this.mouseUp.pipe(
      filter(event => event.button === 2),
      mapTo({ moveInProgress: null })
    ));

    this.connect(this.mouseMove, (vm, event) => {
      if (!vm.moveInProgress) {
        return {};
      }

      return {
        moveInProgress: {
          x: event.x,
          y: event.y
        },
        translation: {
          x: vm.translation.x - vm.moveInProgress.x + event.x,
          y: vm.translation.y - vm.moveInProgress.y + event.y
        }
      }
    });

    this.hold(this.contextMenu.pipe(
      tap(event => event.preventDefault())
    ));
  }

  boardItemTracker(index: number, boardItem: BoardItem): number {
    return boardItem.id;
  }

}
