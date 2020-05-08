import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EurojackpotService {
  private url = 'https://media.lottoland.com/api';

  constructor(private http: HttpClient) {}

}
