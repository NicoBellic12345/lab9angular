import { createReducer, on } from '@ngrx/store';
import { ItemsState, initialState } from './items.state';
import * as ItemsActions from './items.actions';

export const itemsReducer = createReducer(
  initialState,
  
  on(ItemsActions.loadItems, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ItemsActions.loadItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false
  })),
  
  on(ItemsActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(ItemsActions.loadItem, (state) => ({
    ...state,
    loadingDetails: true,
    errorDetails: null
  })),
  
  on(ItemsActions.loadItemSuccess, (state, { item }) => ({
    ...state,
    selectedItem: item,
    loadingDetails: false
  })),
  
  on(ItemsActions.loadItemFailure, (state, { error }) => ({
    ...state,
    loadingDetails: false,
    errorDetails: error
  }))
);