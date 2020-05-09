import { Component, OnInit, OnDestroy } from '@angular/core';

import { Last, Next, Odd } from '../../interfaces/interfaces';
import { EurojackpotService } from '../../services/eurojackpot.service';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';
import { Item, Match } from 'src/app/models/item.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  lastSub: Subscription;

  // Eurojackpot results
  currentResult: Last;

  // Columns for MatTable
  displayedColumns: string[] = ['index', 'match', 'winners', 'amount'];

  // Winner's numbers
  oddList: Odd[] = [];

  // List with prices and winners
  componedList: Item[] = [];

  // Array for winner's matches
  matches: Match[] = [];

  // Managing dates
  actualDate: Date;

  drawDates: Date[] = [];
  currentDate: Date;

  years = [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012];
  yearSelected = 2020;
  yearChanged = false;

  error: any;
  loaded = false;

  constructor(private ejService: EurojackpotService) {}

  ngOnInit(): void {
    // First of all, we need to get the last result calling the GET REST Service
    this.getLastResult();

    // We get all the draw dates assuming there was a draw every Friday
    this.getDrawDates();
  }

  async getLastResult() {
    // We use a promise to keep the flow synchronous
    const resultPromise = new Promise(resolve => {
      this.lastSub = this.ejService.getLastResult().subscribe(
        data => {
          // Print the data and asign to our local variable
          console.log(data);
          this.currentResult = data;

          // Check if there's any winners
          if (this.currentResult.odds) {
            // Take the winners into our odd frame
            this.oddList = Object.values(this.currentResult.odds);
            // Clean removing the first element (rank0: {winners: 0, specialPrize: 0, prize: 0})
            this.oddList.shift();
            // Resolve the promise
            resolve(true);
            return;
          }
          // If there aren't any oficial winners already, we finish here
          this.loaded = true;
          resolve(false);
        },
        error => {
          console.log(error);
          this.error = error;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          });
          this.loaded = true;
          resolve(false);
        }
      );
    });
    // Waiting for our service
    const valid = await resultPromise;
    // It winners, then compose our build to display the table
    if (valid) {
      this.generateArray();
    }
  }

  generateArray() {
    this.componedList = [];
    // Init the matches build
    this.generateMatches();
    // Compose the list using the winners and the matches
    this.oddList.forEach(odd => {
      this.componedList.push(new Item(this.matches.shift(), odd.winners, odd.prize));
    });
    this.loaded = true;
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
    console.log(d);

    // Get all the other Fridays in the month
    while (d.getFullYear() == year) {
      const pushDate = new Date(d.getTime());
      if (yearSelected !== 2020) {
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
    console.log(ev.target.selectedOptions[0].value);
    const date = new Date(ev.target.selectedOptions[0].value);

    // Date formated with 0s
    const dateFormat = ('0' + date.getDate()).slice(-2) + ('0' + (date.getMonth() + 1)).slice(-2) + date.getFullYear();

    const currentDateFormat =   ('0' + this.currentDate.getDate()).slice(-2) + ('0' + (this.currentDate.getMonth() + 1)).slice(-2) + this.currentDate.getFullYear();

    // If the new date is the current date, we get that result from the real service
    if (dateFormat == currentDateFormat) {
      this.getLastResult();
      return;
    }

    // Calling the service with the date formatted as a param
    this.ejService.getDatedResult(dateFormat).subscribe(
      data => {
        this.currentResult = data;
        console.log(this.currentResult);
        this.oddList = Object.values(this.currentResult.odds);
        this.oddList.shift();
        this.generateArray();
      },
      err => {
        // If there aren't any test files for this date
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Results not found',
        });
      }
    );
  }


  showNext() {
    this.ejService.getNext().subscribe(data => {
      Swal.fire('Next draw', `The next draw will be on ${data.drawingDate}`, 'success');
    });
  }

  ngOnDestroy(): void {
    this.lastSub.unsubscribe();
  }
}
