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

  error: any;
  loaded = false;

  constructor(private ejService: EurojackpotService) {}

  ngOnInit(): void {
    // First of all, we need to get the last result calling the GET REST Service
    this.getLastResult();
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

  ngOnDestroy(): void {
    this.lastSub.unsubscribe();
  }
}
