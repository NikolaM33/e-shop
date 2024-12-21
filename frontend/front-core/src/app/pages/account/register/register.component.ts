import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  
  constructor(private accountService:AccountService,
    private toastrService:ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  createUser(){
   this.accountService.createUser(this.registerForm.value).subscribe((data:any)=>{
    if(data){
      this.toastrService.success("User suscesfully created!!")
    }
   }) 
  }
  
}
