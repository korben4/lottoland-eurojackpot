import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { EurojackpotService } from '../../services/eurojackpot.service';
import * as eurojackpotActions from '../actions';

@Injectable()
export class EuroJackpotEffects {
  constructor(private actions$: Actions, private eurojackpotService: EurojackpotService) {}

  cargarUsuario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(eurojackpotActions.loadDateResult),
      mergeMap(action =>
        this.eurojackpotService.getDatedResult(action.date).pipe(
          map(result => eurojackpotActions.loadResultSuccess({ result })),
          catchError(err => of(eurojackpotActions.loadResultError({ payload: err })))
        )
      )
    )
  );
}
