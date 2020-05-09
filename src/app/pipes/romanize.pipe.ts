import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'romanize',
})
export class RomanizePipe implements PipeTransform {
  key = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };

  transform(value: number): string {
    if (isNaN(value)) {
      return;
    }

    let str = '';

    for (const i of Object.keys(this.key)) {
      const q = Math.floor(value / this.key[i]);
      value -= q * this.key[i];
      str += i.repeat(q);
    }

    return str;
  }
}
