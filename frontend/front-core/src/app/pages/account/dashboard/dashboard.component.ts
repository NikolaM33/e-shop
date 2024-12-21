import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { User } from '../User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public openDashboard: boolean = false;
  public currentUser:User;
  constructor(private accountService:AccountService) {
 
  }

  ngOnInit(): void {
    this.accountService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser)
    });
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  logout(){
    this.accountService.logout();
  }
}
