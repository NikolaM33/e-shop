import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// import { Ng2SmartTableModule } from 'ng2-smart-table';
import { UsersRoutingModule } from './users-routing.module';
import { CustomerUserListComponent } from './customer-user-list/customer-user-list.component';
import { CreateUserComponent } from './create-user/create-user.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeUserListComponent } from './employee-user-list/employee-user-list.component';

@NgModule({
  declarations: [CustomerUserListComponent, CreateUserComponent, EmployeeUserListComponent],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    FormsModule,
    TranslateModule
  ]
})
export class UsersModule { }
