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

export const setTokenGroups = createAction(
  '[BoardItems] Set token groups',
  props<{ tokenGroups: TokenGroup[] }>()
);

export const addTokens = createAction(
  '[BoardItems] Create tokens',
  props<{ tokenGroups: TokenGroup[] }>()
);

export const resetTokenCreation = createAction(
  '[AddTokens] Reset token creation'
);
