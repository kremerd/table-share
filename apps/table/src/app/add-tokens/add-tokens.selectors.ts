import { createSelector } from '@ngrx/store';
import { AddTokensState } from './add-tokens.reducer';

export const selectAddTokens = (state: any): AddTokensState => state.addTokens;

export const selectAddTokenGroups = createSelector(
  selectAddTokens,
  state => state.tokenGroups
);

export const selectAddTokenUploadInProgress = createSelector(
  selectAddTokens,
  state => state.uploadInProgress
);
