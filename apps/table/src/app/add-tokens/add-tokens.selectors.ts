import { createSelector } from '@ngrx/store';
import { AddTokensState } from './add-tokens.reducer';

export const selectAddTokens = (state: any): AddTokensState => state.addTokens;

export const selectTokenGroupScale = createSelector(
  selectAddTokens,
  state => state.scale
);

export const selectTokenGroups = createSelector(
  selectAddTokens,
  state => state.tokenGroups
);

export const selectTokenUploadInProgress = createSelector(
  selectAddTokens,
  state => state.uploadInProgress
);
