import { createReducer, on } from '@ngrx/store';
import { setResult, loadDateResult, loadResultSuccess, loadResultError } from '../actions';
import { Last } from '../../interfaces/interfaces';

export interface EuroJackpotState {
  currentResult: Last;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const EuroJackpotInitialState: EuroJackpotState = {
  currentResult: null,
  loaded: false,
  loading: false,
  error: null,
};

const _EuroJackpotReducer = createReducer(
  EuroJackpotInitialState,

  on(setResult, (state, { result }) => ({
    ...state,
    error: null,
    currentResult: { ...result },
  })),

  on(loadDateResult, (state, { date }) => ({
    ...state,
    loading: true,
  })),

  on(loadResultSuccess, (state, { result }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    currentResult: { ...result },
  })),

  on(loadResultError, (state, { payload }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: {
      url: payload.url,
      name: payload.name,
      message: payload.message,
    },
  }))
);

export function EuroJackpotReducer(state, action) {
  return _EuroJackpotReducer(state, action);
}
