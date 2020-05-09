import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { EurojackpotResultInterface, Last } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class EurojackpotService {
  private url = 'https://media.lottoland.com/api';

  constructor(private http: HttpClient) {}

  getLastResult() {
    return this.http.get<EurojackpotResultInterface>(`${this.url}/drawings/euroJackpot`).pipe(map(resp => resp.last));
  }

  getNext() {
    return this.http.get<EurojackpotResultInterface>(`${this.url}/drawings/euroJackpot`).pipe(map(resp => resp.next));
  }

  getDatedResult(date: string) {
    return this.http.get<Last>(`/assets/historical-results/${date}.json`);
  }
}
