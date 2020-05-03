import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { BoardItem } from '@table-share/api-interfaces';
import { fromEvent } from 'rxjs';
import { filter, map, mapTo, tap } from 'rxjs/operators';
import { selectBoardItems } from '../board-items/board-items.selectors';

interface ComponentModel {
  boardItems: BoardItem[];
  translation: Point;
  translationInProgress: Point | null;
}

@Component({
  selector: 'ts-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent extends RxState<ComponentModel> implements AfterViewInit {

  @ViewChild('table')
  tableElement!: ElementRef<HTMLDivElement>;

  constructor(private ngZone: NgZone, store: Store) {
    super();
    this.set({ translation: { x: 0, y: 0 } });

    this.connect(store.pipe(
      select(selectBoardItems),
      map(boardItems => ({ boardItems }))
    ));
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const table = this.tableElement.nativeElement;
      this.setupMouseEvents(table);
    });
  }

  /**
   * Mouse events for board translation are handled in the `capture` phase to prevent
   * interference from drag and drop handlers of the board items.
   * To show off we also run them outside the Angular zone :).
   */
  private setupMouseEvents(table: HTMLDivElement): void {
    this.connect(fromEvent<MouseEvent>(table, 'mousedown', { capture: true }).pipe(
      filter(event => event.button === 2),
      map(({ x, y }) => ({ translationInProgress: { x, y } }))
    ));

    this.connect(fromEvent<MouseEvent>(table, 'mousemove', { capture: true }), (vm, event) => {
      if (!vm.translationInProgress) {
        return {};
      }

      return {
        translationInProgress: {
          x: event.x,
          y: event.y
        },
        translation: {
          x: vm.translation.x + event.x - vm.translationInProgress.x,
          y: vm.translation.y + event.y - vm.translationInProgress.y
        }
      }
    });

    this.connect(fromEvent<MouseEvent>(table, 'mouseup', { capture: true }).pipe(
      filter(event => event.button === 2),
      mapTo({ translationInProgress: null })
    ));

    this.hold(fromEvent<MouseEvent>(table, 'contextmenu', { capture: true }).pipe(
      tap(event => event.preventDefault())
    ));
  }

  boardItemTracker(index: number, boardItem: BoardItem): number {
    return boardItem.id;
  }

}
