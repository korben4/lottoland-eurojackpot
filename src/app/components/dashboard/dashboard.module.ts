import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { NgxLoadingModule } from 'ngx-loading';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, FormsModule, MatTableModule, NgxLoadingModule.forRoot({}), PipesModule],
})
export class DashboardModule {}
