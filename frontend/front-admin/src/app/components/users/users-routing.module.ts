import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerUserListComponent } from './customer-user-list/customer-user-list.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EmployeeUserListComponent } from './employee-user-list/employee-user-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-user',
        component: CustomerUserListComponent,
        data: {
          title: "CUSTOMER_LIST",
          breadcrumb: "CUSTOMER_LIST"
        }
      },
            {
        path: 'list-employee',
        component: EmployeeUserListComponent,
        data: {
          title: "EMPLOYEE_LIST",
          breadcrumb: "EMPLOYEE_LIST"
        }
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
        data: {
          title: "CREATE_USER",
          breadcrumb: "CREATE_USER"
        }
      },
       {
        path: 'edit-user/:userId',
        component: CreateUserComponent,
        data: {
          title: "CREATE_USER",
          breadcrumb: "CREATE_USER"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
