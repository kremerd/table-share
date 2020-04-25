import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardItem, Token, TokenEssentials } from '@table-share/api-interfaces';
import { generateRandomId } from '@table-share/util';
import { Socket } from 'ngx-socket-io';
import { EMPTY, from } from 'rxjs';
import { catchError, concatMap, map, mergeMap, mergeMapTo, tap } from 'rxjs/operators';
import { createBoardItem, createTokens, deleteBoardItem, loadBoardItems, updateBoardItem, updateBoardItems } from './board-items.actions';

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

  createTokens$ = createEffect(() => this.actions$.pipe(
    ofType(createTokens),
    map(({ tokenGroups }) => tokenGroups
      .map(({ name, image, amount }) => Array<TokenEssentials>(amount).fill({ name, image }))
      .flat()
      .map((essentials, i): Token => ({
        type: 'token',
        id: generateRandomId(),
        x: 30 * i,
        y: 30 * i,
        ...essentials
      }))
      .map(token => createBoardItem({ boardItem: token }))
    ),
    mergeMap(actions => from(actions))
  ));

}
