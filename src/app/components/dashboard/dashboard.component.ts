import { Component, OnInit } from '@angular/core';
import { EurojackpotService } from '../../services/eurojackpot.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private ejService: EurojackpotService) {}

  error: any;

  ngOnInit(): void {
    this.ejService.getLastResult().subscribe(
      data => {
        console.log(data);
      },
      error => {
        this.error = error;
        console.log(error);
      }
    );
  }
}
