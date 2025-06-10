import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../../models/user';
import { userInfo } from 'os';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: UntypedFormGroup;
  public registerForm: UntypedFormGroup;
  public active = 1;
  public errorMessage: any;

  constructor(private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.createLoginForm();
    this.createRegisterForm();
  }

  owlcarousel = [
    {
      title: "Welcome to SkiZone",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to SkiZone",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to SkiZone",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    }
  ]
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true
  };

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: [''],
    })
  }
  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      username: [''],
      password: [''],
      confirmPassword: [''],
    })
  }


  ngOnInit() {
  }



  loginUser() {
    let email = this.loginForm.controls['username'].value;
    let password = this.loginForm.controls['password'].value;
    const formData = {
      email: email,
      password: password
    }

    this.authService.login(formData).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.authService.setUser(response.user);
        this.router.navigateByUrl("/dashboard");
        this.errorMessage = null;
      },
      error: (err) => {
        // on login failure
        if (err.status === 400) {
          this.errorMessage = "Access Denied: Invalid username or password.";
        } else {
          this.errorMessage = "An unexpected error occurred.";
        }
      }
    });
  }


}
