import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/account.service';

@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss']
})
export class HeaderOneComponent implements OnInit {
  
  @Input() class: string;
  @Input() themeLogo: string = 'assets/images/icon/logo-10.png'; // Default Logo
  @Input() topbar: boolean = true; // Default True
  @Input() sticky: boolean = false; // Default false
  
  public stick: boolean = false;
  loggedUser: boolean = false;
  constructor(private accountService:AccountService,
   private  router :Router
  ) { }

  ngOnInit(): void {
    this.accountService.currentUser.subscribe(user=>{
      this.loggedUser = user!=null ? true : false;
    })

  }

  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  	if (number >= 150 && window.innerWidth > 400) { 
  	  this.stick = true;
  	} else {
  	  this.stick = false;
  	}
  }
  logoutUser(){
    this.accountService.logout();
  }

  navigateToLogin(){
    this.router.navigateByUrl("/shop/login")
  }

  navigateToRegister(){
    this.router.navigateByUrl("/shop/register")
  }
}
