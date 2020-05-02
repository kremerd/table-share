import { Action, createReducer, on } from '@ngrx/store';
import { TokenGroup } from '@table-share/api-interfaces';
import { addTokenEssentials, addTokenImages, resetTokenCreation, setTokenGroups, setTokenGroupScale } from './add-tokens.actions';

export interface AddTokensState {
  scale: number;
  tokenGroups: TokenGroup[];
  uploadInProgress: boolean;
}

export const INITIAL_STATE: AddTokensState = {
  scale: 100,
  tokenGroups: [],
  uploadInProgress: false
};

export const reducer = createReducer<AddTokensState>(INITIAL_STATE,

  on(addTokenImages, (state) => ({ ...state, uploadInProgress: true })),

  on(addTokenEssentials, ({ scale, tokenGroups }, { tokenEssentials }) => ({
    scale,
    tokenGroups: [
      ...tokenGroups,
      ...tokenEssentials.map(tokenEssential => ({ ...tokenEssential, amount: 1 }))
    ],
    uploadInProgress: false
  })),

  on(setTokenGroupScale, (state, { scale }) => ({ ...state, scale })),
  on(setTokenGroups, (state, { tokenGroups }) => ({ ...state, tokenGroups })),
  on(resetTokenCreation, _ => INITIAL_STATE)

);

export const addTokensReducer = (state: AddTokensState | undefined, action: Action) =>
  reducer(state, action);
