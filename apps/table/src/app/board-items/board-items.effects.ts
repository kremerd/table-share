import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardItem } from '@table-share/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { EMPTY } from 'rxjs';
import { catchError, concatMap, map, mergeMapTo, tap } from 'rxjs/operators';
import { createBoardItem, deleteBoardItem, loadBoardItems, updateBoardItem, updateBoardItems } from './board-items.actions';

@Injectable()
export class BoardItemsEffects {

  constructor(
    private actions$: Actions,
    private socket: Socket
  ) { }

  loadBoardItem$ = createEffect(() => this.actions$.pipe(
    ofType(loadBoardItems),
    tap(() => this.socket.emit('getBoardItems')),
    concatMap(() => this.socket.fromEvent<BoardItem[]>('boardItems').pipe(
      map(boardItems => updateBoardItems({ boardItems })),
      catchError(() => EMPTY)
    ))
  ));

  createBoardItem$ = createEffect(() => this.actions$.pipe(
    ofType(createBoardItem),
    tap(({ boardItem }) => this.socket.emit('createBoardItem', boardItem)),
    mergeMapTo(EMPTY)
  ));

  updateBoardItem$ = createEffect(() => this.actions$.pipe(
    ofType(updateBoardItem),
    tap(({ boardItem }) => this.socket.emit('updateBoardItem', boardItem)),
    mergeMapTo(EMPTY)
  ));

  deleteBoardItem$ = createEffect(() => this.actions$.pipe(
    ofType(deleteBoardItem),
    tap(({ boardItemId }) => this.socket.emit('deleteBoardItem', boardItemId)),
    mergeMapTo(EMPTY)
  ));

}
