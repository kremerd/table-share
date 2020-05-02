import { createAction, props } from '@ngrx/store';
import { TokenEssentials } from '@table-share/api-interfaces';

export const addTokenImages = createAction(
  '[AddTokens] Add token images',
  props<{ images: File[] }>()
);

export const addTokenEssentials = createAction(
  '[AddTokens] Add token essentials',
  props<{ tokenEssentials: TokenEssentials[] }>()
);
