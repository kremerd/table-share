import { Action, createReducer, on } from '@ngrx/store';
import { TokenGroup } from '@table-share/api-interfaces';
import { addTokenEssentials, addTokenImages, resetTokenCreation } from './add-tokens.actions';

export interface AddTokensState {
  tokenGroups: TokenGroup[];
  uploadInProgress: boolean;
}

export const reducer = createReducer<AddTokensState>({ tokenGroups: [], uploadInProgress: false },

  on(addTokenImages, ({ tokenGroups }) => ({
    tokenGroups: tokenGroups,
    uploadInProgress: true
  })),

  on(addTokenEssentials, ({ tokenGroups }, { tokenEssentials }) => ({
    tokenGroups: [
      ...tokenGroups,
      ...tokenEssentials.map(tokenEssential => ({ ...tokenEssential, amount: 1 }))
    ],
    uploadInProgress: false
  })),

  on(resetTokenCreation, _ => ({ tokenGroups: [], uploadInProgress: false }))

);

export const addTokensReducer = (state: AddTokensState | undefined, action: Action) =>
  reducer(state, action);
