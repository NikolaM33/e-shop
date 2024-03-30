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

  constructor(private formBuilder: UntypedFormBuilder,
    private authService:AuthService,
    private router: Router) {
    this.createLoginForm();
    this.createRegisterForm();
  }

  owlcarousel = [
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Multikart",
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

  

  loginUser(){
    let email=this.loginForm.controls['username'].value;
    let password=this.loginForm.controls['password'].value;
    const formData = this.loginForm.getRawValue();
    
    this.authService.login(formData).subscribe((response)=>{
      this.authService.setToken(response.token);
      this.authService.setUser(response.user);
     this.router.navigateByUrl("/dashboard/default")
    })
  }
  registerUser(){
    let user= new User();
    user.email=this.registerForm.controls['userName'].value;
    user.password= this.registerForm.controls['password'].value;
    // this.authService.registerUser(user).subscribe((res)=>{
    //   console.log(res)
    // });
  }

}
