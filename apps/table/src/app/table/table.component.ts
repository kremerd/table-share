import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { BoardItem } from '@table-share/api-interfaces';
import { fromEvent } from 'rxjs';
import { filter, map, mapTo, tap } from 'rxjs/operators';
import { selectBoardItems } from '../board-items/board-items.selectors';
import { WINDOW } from '../window-provider';

interface ComponentModel {
  boardItems: BoardItem[];
  preventNextContextMenu: boolean;
  scale: number;
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

  constructor(private ngZone: NgZone, store: Store, @Inject(WINDOW) private window: Window) {
    super();
    this.set({
      boardItems: [],
      preventNextContextMenu: false,
      scale: 1,
      translation: { x: 0, y: 0 },
      translationInProgress: null
    });

    this.connect(store.pipe(
      select(selectBoardItems),
      map(boardItems => ({ boardItems }))
    ));
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const table = this.tableElement.nativeElement;
      this.setupPointerEvents(table);
    });
  }

  /**
   * Pointer events for board translation are handled in the `capture` phase to prevent
   * interference from drag and drop handlers of the board items.
   * To show off we also run them outside the Angular zone :).
   */
  private setupPointerEvents(table: HTMLDivElement): void {
    this.connect(fromEvent<PointerEvent>(table, 'pointerdown', { capture: true }).pipe(
      filter(event => event.button === 2),
      tap(event => table.setPointerCapture(event.pointerId)),
      map(({ x, y }) => ({ translationInProgress: { x, y } }))
    ));

    this.connect(fromEvent<PointerEvent>(table, 'pointermove', { capture: true }), (vm, event: PointerEvent) => {
      if (!vm.translationInProgress) {
        return {};
      }

      return {
        preventNextContextMenu: true,
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

    this.connect(fromEvent<PointerEvent>(table, 'pointerup', { capture: true }).pipe(
      filter(event => event.button === 2),
      tap(event => table.releasePointerCapture(event.pointerId)),
      mapTo({ translationInProgress: null })
    ));

    this.connect(fromEvent<MouseEvent>(this.window, 'contextmenu'), (vm, event: MouseEvent) => {
      if (vm.preventNextContextMenu) {
        event.preventDefault();
      }

      return { preventNextContextMenu: false };
    });

    this.connect(fromEvent<WheelEvent>(table, 'wheel'), (vm, event: WheelEvent) => ({
      scale: vm.scale * (1 - event.deltaY * 0.01)
    }));
  }

  boardItemTracker(index: number, boardItem: BoardItem): number {
    return boardItem.id;
  }

}
