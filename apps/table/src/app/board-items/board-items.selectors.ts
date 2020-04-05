import { BoardItem } from '@table-share/api-interfaces';

export const selectBoardItems = (state: any): BoardItem[] => state.boardItems;
