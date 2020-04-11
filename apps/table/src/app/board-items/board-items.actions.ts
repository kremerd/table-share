import { createAction, props } from '@ngrx/store';
import { BoardItem } from '@table-share/api-interfaces';

export const loadBoardItems = createAction(
  '[BoardItems] Load'
);

export const updateBoardItems = createAction(
  '[BoardItems] Update all',
  props<{ boardItems: BoardItem[] }>()
);

export const createBoardItem = createAction(
  '[BoardItems] Create',
  props<{ boardItem: BoardItem }>()
);

export const updateBoardItem = createAction(
  '[BoardItems] Update',
  props<{ boardItem: BoardItem }>()
);

export const deleteBoardItem = createAction(
  '[BoardItems] Delete',
  props<{ boardItemId: number }>()
);
