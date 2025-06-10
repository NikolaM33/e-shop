import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../users/user.service';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public active = 1;
  public user;
  public passwordForm: UntypedFormGroup;
  constructor(private userService: UserService, private authService: AuthService, private formBuilder: UntypedFormBuilder,
    private toastrService: ToastrService, private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      confirmNewPassword: ['', Validators.required]
    })
    this.passwordForm.get('confirmNewPassword')?.setValidators([
      Validators.required,
      Validators.minLength(5),
      this.passwordMatchValidator('newPassword')
    ]);

    this.passwordForm.get('confirmNewPassword')?.updateValueAndValidity();
    this.user = this.authService.getUser();
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

  changePassword() {
    const password = {
      currentPassword: this.passwordForm.get('currentPassword').value,
      newPassword: this.passwordForm.get('newPassword').value
    }
    this.userService.changePassword(this.user.id, password).subscribe({
      next: (data: any) => {
        this.toastrService.success(this.translateService.instant("PASSWORD_SUCESSFULLY_CHANGED"), this.translateService.instant("SUCESS"));
      },
      error: (error) => {
        this.toastrService.error(this.translateService.instant("ERROR_CHANGING_PASSWORD"), this.translateService.instant("ERROR"));
      }
    });
  }
}
