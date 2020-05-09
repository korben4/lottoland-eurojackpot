import { ActionReducerMap } from '@ngrx/store';
import * as reducers from './reducers';

export interface AppState {
  euroJackpotReducer: reducers.EuroJackpotState;
}

export const appReducers: ActionReducerMap<AppState> = {
  euroJackpotReducer: reducers.EuroJackpotReducer,
};
