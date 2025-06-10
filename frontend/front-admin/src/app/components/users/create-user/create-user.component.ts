import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  public accountForm: UntypedFormGroup;
  public permissionForm: UntypedFormGroup;
  public active = 1;
  public userId: string;
  public user: any;
  constructor(private formBuilder: UntypedFormBuilder, private userService: UserService, private route: ActivatedRoute,
    private router: Router
  ) {
    this.createAccountForm();
    this.createPermissionForm();

    this.userId = this.route.snapshot.paramMap.get('userId');

  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      type: ['CUSTOMER', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      confirmPwd: ['', Validators.required]
    });

    this.accountForm.get('confirmPwd')?.setValidators([
      Validators.required,
      Validators.minLength(5),
      this.passwordMatchValidator('password')
    ]);

    this.accountForm.get('confirmPwd')?.updateValueAndValidity();


  }

  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({
      ADD_PRODUCT: ['false'],
      UPDATE_PRODUCT: ['false'],
      DELETE_PRODUCT: ['false'],
      APPLY_DISCOUNT: ['false'],
      ADD_CATEGORY: ['false'],
      UPDATE_CATEGORY: ['false'],
      DELETE_CATEGORY: ['false']
    });
  }

  ngOnInit() {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((data: any) => {
        this.user = data;
        this.setUpFormData();
      });

    }

    this.accountForm.get('password')?.valueChanges.subscribe(() => {
      this.accountForm.get('confirmPwd')?.updateValueAndValidity();
    });


  }


  createUser() {
    const userData = {
      ...this.accountForm.value,
      permissions: this.formatPermissions(this.permissionForm.value)
    };

    const navigateTo = (type: string) => {
      return type === 'CUSTOMER' ? '/users/list-user' : '/users/list-employee';
    };

    const saveUser = (userData: any) => {
      const userRequest = this.userId ? this.userService.updateUser(this.userId, userData) : this.userService.createUser(userData);
      userRequest.subscribe((data: any) => {
        this.router.navigate([navigateTo(data.type)]);
      });
    };

    saveUser(userData);
  }

  formatPermissions(permissionValue: any): any {
    return Object.keys(permissionValue).reduce((acc, key) => {
      acc[key] = permissionValue[key] === 'true';
      return acc;
    }, {});
  }


  setUpFormData() {
    this.accountForm.get("type").setValue(this.user.type);
    this.accountForm.get("firstName").setValue(this.user.firstName);
    this.accountForm.get("lastName").setValue(this.user.lastName);
    this.accountForm.get("email").setValue(this.user.email);

    this.permissionForm.get("ADD_PRODUCT").setValue(String(this.user.permissions?.ADD_PRODUCT));
    this.permissionForm.get("ADD_CATEGORY").setValue(String(this.user.permissions?.ADD_CATEGORY));
    this.permissionForm.get("APPLY_DISCOUNT").setValue(String(this.user.permissions?.APPLY_DISCOUNT));
    this.permissionForm.get("DELETE_CATEGORY").setValue(String(this.user.permissions?.DELETE_CATEGORY));
    this.permissionForm.get("DELETE_PRODUCT").setValue(String(this.user.permissions?.DELETE_PRODUCT));
    this.permissionForm.get("UPDATE_CATEGORY").setValue(String(this.user.permissions?.UPDATE_CATEGORY));
    this.permissionForm.get("UPDATE_PRODUCT").setValue(String(this.user.permissions?.UPDATE_PRODUCT));

    this.accountForm.get('password').disable();
    this.accountForm.get('password').clearValidators()
    this.accountForm.get('password').updateValueAndValidity()
    this.accountForm.get('confirmPwd').disable();
    this.accountForm.get('confirmPwd').clearValidators();
    this.accountForm.get('confirmPwd').updateValueAndValidity();
  }

  passwordMatchValidator(passwordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.parent.get(passwordControlName);
      const confirmPassword = control;
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { 'passwordMismatch': true };
      }
      return null;
    };
  }
}
