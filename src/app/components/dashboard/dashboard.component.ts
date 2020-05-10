import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Item, Match } from 'src/app/models/item.model';
import Swal from 'sweetalert2';

import { Last, Odd } from '../../interfaces/interfaces';
import { EurojackpotService } from '../../services/eurojackpot.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { filter } from 'rxjs/operators';
import { setResult, loadDateResult } from '../../store/actions/euroJackpot.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  // Eurojackpot results
  currentResult: Last;

  // Columns for MatTable
  displayedColumns: string[] = ['index', 'match', 'winners', 'amount'];

  // Winning numbers
  oddList: Odd[] = [];

  // List with prices and winners
  componedList: Item[] = [];

  // Array for winner's matches
  matches: Match[] = [];

  // Managing dates
  actualDate: Date;

  /* Date section*/

  // Dates array for fill the combo
  drawDates: Date[] = [];
  // Date of the last draw
  currentDate: Date;

  // Array for fill the year's combo
  years = [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012];
  yearSelected = 2020;
  yearChanged = false;

  // Aux vars
  error: any;
  loading = true;
  auxDate: Date;

  constructor(private ejService: EurojackpotService, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.subscriptions.push(
      // Subscribing to the store data for the reducer
      this.store
        .select('euroJackpotReducer')
        // Checking guard for null
        .pipe(filter(({ currentResult }) => currentResult != null))
        .subscribe(({ currentResult, error, loading }) => {
          this.currentResult = currentResult;
          this.loading = loading;

          if (error) {
            this.manageError(error);
            return;
          }

          // Creating the date for display
          const { day, month, year } = this.currentResult.date;
          this.auxDate = new Date(year, month - 1, day);

          // Check if there's any winners
          if (this.currentResult.odds) {
            // Take the winners into our odd frame
            this.oddList = Object.values(this.currentResult.odds);
            // Clean removing the first element (rank0: {winners: 0, specialPrize: 0, prize: 0})
            this.oddList.shift();
            this.generateArray();
          }
        })
    );
    // First of all, we need to get the last result calling the GET REST Service
    this.getLastResult();

    // We get all the draw dates assuming there was a draw every Friday
    this.getDrawDates();
  }

  getLastResult() {
    this.subscriptions.push(
      this.ejService.getLastResult().subscribe(
        data => {
          // Dispatch the action which set the data
          this.store.dispatch(setResult({ result: data }));
        },
        error => {
          this.manageError(error);
          this.loading = false;
        }
      )
    );
  }

  generateArray() {
    this.componedList = [];
    // Init the matches build
    this.generateMatches();
    // Compose the list using the winners and the matches
    this.oddList.forEach(odd => {
      this.componedList.push(new Item(this.matches.shift(), odd.winners, odd.prize));
    });
  }

  generateMatches() {
    this.matches = [
      { number: 5, euronumber: 2 },
      { number: 5, euronumber: 1 },
      { number: 5, euronumber: 0 },
      { number: 4, euronumber: 2 },
      { number: 4, euronumber: 1 },
      { number: 4, euronumber: 0 },
      { number: 3, euronumber: 2 },
      { number: 2, euronumber: 2 },
      { number: 3, euronumber: 1 },
      { number: 3, euronumber: 0 },
      { number: 1, euronumber: 2 },
      { number: 2, euronumber: 1 },
    ];
  }

  // Getting all the fridays in a year
  getDrawDates(yearSelected = 2020) {
    // Default is the present year
    const d = new Date('01/01/' + yearSelected);
    const year = yearSelected || d.getFullYear();
    d.setDate(1);

    // Get the first Friday in the month
    while (d.getDay() !== 5) {
      d.setDate(d.getDate() + 1);
    }

    // Get all the other Fridays in the month
    while (d.getFullYear() == year) {
      const pushDate = new Date(d.getTime());
      if (yearSelected != 2020) {
        this.drawDates.unshift(pushDate);
      } else if (pushDate < new Date()) {
        this.drawDates.unshift(pushDate);
      }
      d.setDate(d.getDate() + 7);
    }

    // Managing the date to show
    if (!this.yearChanged) {
      this.currentDate = this.drawDates.shift();
    }
  }

  // Listener for year's select
  // When the year is changed, we fill again the combo with the draw dates according to the new year selected
  changeYear(ev) {
    this.yearChanged = true;
    this.drawDates = [];
    this.getDrawDates(ev.target.selectedOptions[0].value);
  }

  // Listener for date's select
  // Function to simulate a call to get an specifig result in a date
  // Actually we call a local library with json test files
  getDatedResult(ev) {
    const date = new Date(ev.target.selectedOptions[0].value);

    // Date formated with 0s
    const dateFormat = ('0' + date.getDate()).slice(-2) + ('0' + (date.getMonth() + 1)).slice(-2) + date.getFullYear();

    const currentDateFormat =
      ('0' + this.currentDate.getDate()).slice(-2) + ('0' + (this.currentDate.getMonth() + 1)).slice(-2) + this.currentDate.getFullYear();

    // If the new date is the current date, we get that result from the real service
    if (dateFormat == currentDateFormat) {
      this.getLastResult();
      return;
    }

    this.store.dispatch(loadDateResult({ date: dateFormat }));
  }

  // Show the next draw date
  showNext() {
    this.subscriptions.push(
      this.ejService.getNext().subscribe(data => {
        Swal.fire('Next draw', `The next draw will be on ${data.drawingDate}`, 'success');
      })
    );
  }

  manageError(error: any) {
    this.error = error;
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sc => {
      sc.unsubscribe();
    });
  }
}
