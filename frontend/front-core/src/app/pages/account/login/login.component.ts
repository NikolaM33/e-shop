import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
 errorMessage: string | null = null;
  constructor(private accountService: AccountService,
    private router: Router, private fb: FormBuilder ) {
      
     }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loginUser(){
    this.accountService.login(this.loginForm.value).subscribe({
      next: (response) =>{
      this.accountService.setToken(response.token);
      this.accountService.setUser(response.user);
      this.router.navigateByUrl("/shop/dashboard")
      },
      error: (err) =>{
         if (err.status === 403) {
          this.errorMessage = "Access Denied: Invalid username or password.";
        } else {
          this.errorMessage = "An unexpected error occurred.";
      }
    }
    });
  
  }




}
