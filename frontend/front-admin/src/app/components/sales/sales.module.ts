import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesRoutingModule } from './sales-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { OrderDetailsComponent } from './order-details/order-details.component';


@NgModule({

  declarations: [OrdersComponent, OrderDetailsComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    NgbModule,
    FormsModule,
    Ng2SearchPipeModule,
    SharedModule,
    Ng2SearchPipeModule,
    TranslateModule
  ]
})
export class SalesModule { }
