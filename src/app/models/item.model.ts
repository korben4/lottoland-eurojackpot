export interface Match {
  number: number;
  euronumber: number;
}
export class Item {
  public match: Match;
  public winners: number;
  public amount: number;

  constructor(match: Match, winners: number, amount: number) {
    this.match = match;
    this.winners = winners;
    this.amount = amount;
  }
}
