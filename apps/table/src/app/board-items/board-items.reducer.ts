import { Action, createReducer, on } from '@ngrx/store';
import { BoardItem, generateRandomId } from '@table-share/api-interfaces';
import { createBoardItem, deleteBoardItem, updateBoardItem, updateBoardItems } from './board-items.actions';

export const reducer = createReducer<BoardItem[]>([],

  on(updateBoardItems, (_, { boardItems }) => boardItems),

  on(createBoardItem, (boardItems, { boardItem }) => {
    return [
      ...boardItems,
      { id: generateRandomId(), type: 'DEFAULT', x: 0, y: 0, ...boardItem }
    ]
  }),

  on(updateBoardItem, (boardItems, { boardItem }) => {
    const index = boardItems.findIndex(item => item.id === boardItem.id);
    return [...boardItems.slice(0, index), boardItem, ...boardItems.slice(index + 1)];
  }),

  on(deleteBoardItem, (boardItems, { boardItemId }) => {
    const index = boardItems.findIndex(item => item.id === boardItemId);
    return [...boardItems.slice(0, index), ...boardItems.slice(index + 1)];
  })

);

export const boardItemsReducer = (state: BoardItem[], action: Action) =>
  reducer(state, action);
