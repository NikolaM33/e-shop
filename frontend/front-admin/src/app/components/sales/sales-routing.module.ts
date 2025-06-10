import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'orders',
        component: OrdersComponent,
        data: {
          title: "ORDERS",
          breadcrumb: "ORDERS"
        }
      },
       {
        path: 'orders/:orderId',
        component: OrderDetailsComponent,
        data: {
          title: "ORDER_DETAILS",
          breadcrumb: "ORDER_DETAILS"
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
