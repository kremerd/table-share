import { Action, createReducer, on } from '@ngrx/store';
import { BoardItem } from '@table-share/api-interfaces';
import { removeById, updateById } from '@table-share/util';
import { createBoardItem, deleteBoardItem, updateBoardItem, updateBoardItems } from './board-items.actions';

export const reducer = createReducer<BoardItem[]>([],

  on(updateBoardItems, (_, { boardItems }) => boardItems),

  on(createBoardItem, (boardItems, { boardItem }) => {
    return [...boardItems, boardItem];
  }),

  on(updateBoardItem, (boardItems, { boardItem }) => {
    return updateById(boardItems, boardItem);
  }),

  on(deleteBoardItem, (boardItems, { boardItemId }) => {
    return removeById(boardItems, boardItemId);
  })

);

export const boardItemsReducer = (state: BoardItem[] | undefined, action: Action) =>
  reducer(state, action);
