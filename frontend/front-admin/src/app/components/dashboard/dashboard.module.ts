import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CountToModule } from 'angular-count-to';
import { NgChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChartistModule } from 'ng-chartist';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CountToModule,
    SharedModule,
    NgChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    TranslateModule
  ],
  

})
export class DashboardModule { }
