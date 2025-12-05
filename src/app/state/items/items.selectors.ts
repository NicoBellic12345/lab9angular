import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState } from './items.state';

export const selectItemsState = createFeatureSelector<ItemsState>('items');

export const selectAllItems = createSelector(
  selectItemsState,
  (state: ItemsState) => state.items
);

export const selectItemsLoading = createSelector(
  selectItemsState,
  (state: ItemsState) => state.loading
);

export const selectItemsError = createSelector(
  selectItemsState,
  (state: ItemsState) => state.error
);

export const selectSelectedItem = createSelector(
  selectItemsState,
  (state: ItemsState) => state.selectedItem
);

export const selectItemLoadingDetails = createSelector(
  selectItemsState,
  (state: ItemsState) => state.loadingDetails
);

export const selectItemErrorDetails = createSelector(
  selectItemsState,
  (state: ItemsState) => state.errorDetails
);