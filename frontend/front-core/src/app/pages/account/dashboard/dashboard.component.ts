import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { User } from '../User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
 activeTab: string = 'account-info'
  public openDashboard: boolean = false;
  public currentUser:User;
  constructor(private accountService:AccountService) {
        this.accountService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
 
  }

  ngOnInit(): void {
    this.accountService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  logout(){
    this.accountService.logout();
  }

   showTab(tabName: string) {
    this.activeTab = tabName;
  }
}
