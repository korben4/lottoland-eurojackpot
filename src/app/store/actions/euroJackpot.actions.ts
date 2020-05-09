import { createAction, props } from '@ngrx/store';

import { Last } from '../../interfaces/interfaces';

export const setResult = createAction('[Result] Set Result', props<{ result: Last }>());

export const loadDateResult = createAction('[Result] Load Result', props<{ date: string }>());

export const loadResultSuccess = createAction('[Result] Load Result Success', props<{ result: Last }>());

export const loadResultError = createAction('[Result] Load Result Error', props<{ payload: any }>());
