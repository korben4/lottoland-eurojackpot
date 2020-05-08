

export interface EurojackpotResultInterface {
  last: Last;
  next: Next;
}

export interface Last {
  nr: number;
  currency: string;
  date: DateClass;
  closingDate: string;
  lateClosingDate: string;
  drawingDate: string;
  numbers: number[];
  euroNumbers: number[];
  jackpot: string;
  marketingJackpot: string;
  specialMarketingJackpot: string;
  climbedSince: number;
  Winners: number;
  odds: { [key: string]: Odd };
}

export interface DateClass {
  full: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  dayOfWeek: string;
}

export interface Odd {
  winners: number;
  specialPrize: number;
  prize: number;
}

export interface Next {
  nr: number;
  currency: string;
  date: DateClass;
  closingDate: string;
  lateClosingDate: string;
  drawingDate: string;
  jackpot: string;
  marketingJackpot: string;
  specialMarketingJackpot: string;
  climbedSince: number;
}
