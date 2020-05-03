import { createAction, props } from '@ngrx/store';
import { TokenEssentials, TokenGroup } from '@table-share/api-interfaces';

export const addTokenImages = createAction(
  '[AddTokens] Add token images',
  props<{ images: File[] }>()
);

export const addTokenEssentials = createAction(
  '[AddTokens] Add token essentials',
  props<{ tokenEssentials: TokenEssentials[] }>()
);

export const setTokenGroupScale = createAction(
  '[AddTokens] Set token group scale',
  props<{ scale: number }>()
);

export const setTokenGroups = createAction(
  '[AddTokens] Set token groups',
  props<{ tokenGroups: TokenGroup[] }>()
);

export const addTokens = createAction(
  '[AddTokens] Add tokens',
  props<{ scale: number, tokenGroups: TokenGroup[] }>()
);

export const resetTokenCreation = createAction(
  '[AddTokens] Reset token creation'
);
