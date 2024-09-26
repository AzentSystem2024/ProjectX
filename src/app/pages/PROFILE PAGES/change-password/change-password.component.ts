import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule, DxValidationGroupComponent, DxValidationGroupModule, DxValidatorModule } from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { UserService } from 'src/app/services/user.service';
import { MasterReportService } from '../../MASTER PAGES/master-report.service';
import notify from 'devextreme/ui/notify';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild('validationGroup', { static: true })
  validationGroup: DxValidationGroupComponent;

  securityPolicyData: any;
  UserID: any;
  oldPassword: any;
  getOldPassword:any;
  newPassword: string = '';
  confirmPassword: string = '';
  confirmPasswordBorderColor: string = '1px solid #ddd'; // Default border color
  oldPasswordBorderColor: string = '1px solid #ddd'; // Default border color
  oldPasswordError: string = ''; // Error message for old password validation
  dummyId:any;
  showConfirmPassword: boolean = false;
  isPasswordVisible: boolean = false;
  isOldPasswordVisible: boolean = false;

  constructor(private service: MasterReportService,private authService:AuthService,private route:Router) {
    this.UserID=sessionStorage.getItem('UserID');
    console.log(this.dummyId,"dummy")
  }

  // isValid() {
  //   return this.validationGroup.instance.validate().isValid;
  // }

  validatePasswordMatch = (): boolean => {
    return this.newPassword === this.confirmPassword;
  };

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible; // Toggle the visibility
}
  toggleOldPasswordVisibility(): void {
    this.isOldPasswordVisible = !this.isOldPasswordVisible; // Toggle the visibility
  }

  saveNewPassword(){

    // Validate the entire validation group
  const validationResult = this.validationGroup.instance.validate();

  // Check if the form is valid before proceeding
  if (!validationResult.isValid) {
    return; // Stop execution if form is not valid; error messages will be shown next to the fields
  }

  // Check if the new password meets the security policy
  if (!this.checkPasswordStrength()) {
    // Show error message if the password does not meet the security policy
    notify(
      {
        message: 'New password does not meet the security requirements.',
        position: { at: 'top right', my: 'top right' },
        displayTime: 500,
      },
      'error'
    );
    return; // Stop execution if the password does not meet the policy
  }

    const PasswordData={
      UserID:this.UserID,
      NewPassword:this.newPassword,
      ChangePasswordOnLogin:false,
      ModifiedFrom:this.UserID
    }
    console.log(PasswordData,"password form data")

    this.service.reset_Password(PasswordData).subscribe(res=>{
      try {
      if(res.message==='Success')
      {
        notify(
          {
            message: 'Password Updated successfully',
            position: { at: 'top right', my: 'top right' },
            displayTime: 500,
          },
          'success'
        );
        // Navigate to login page after notification
        setTimeout(() => {
          this.authService.logOut();
        }, 500); // Wait for notification to display before navigating
      }
      } catch (error) {
        notify(
          {
            message: 'Password update operation failed',
            position: { at: 'top right', my: 'top right' },
            displayTime: 500,
          },
          'error'
        );
      }
    });
  }

  closeChangePassword(){
    this.route.navigateByUrl('/analytics-dashboard');
  }

  validateField(fieldName: string): boolean {
    // Trigger validation for a specific field
    const instance = (document.getElementById(fieldName) as any)
      .dxValidator?.instance();
    if (instance) {
      return instance.validate().isValid;
    }
    return false;
  }

  ngOnInit(): void {
    this.getSecurityPolicyData();
    this.getUserPassword();
  }

  onOldPasswordValueChanged(event: any): void {
    this.oldPassword = event.value;
  }

   // Custom validation function for old password
   validateOldPassword = (params: any): boolean => {
    // // Check if oldPassword is set to avoid running validation unnecessarily
    // if (!this.oldPassword || !this.getOldPassword) {
    //   return false;
    // }

    if (this.oldPassword !== this.getOldPassword) {
      params.rule.message = 'Incorrect password'; // Set custom error message
      this.oldPasswordBorderColor='2px solid green';
      return false; // Validation fails
    }
    return true; // Validation passes
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getUserPassword() {
    this.service.get_User_Data_By_Id(this.UserID).subscribe((res: any) => {
      this.getOldPassword = res.Password;
      console.log(this.oldPassword, 'old password');
    });
  }

  getSecurityPolicyData() {
    this.service.getUserSecurityPolicityData().subscribe((res: any) => {
      this.securityPolicyData = res.data[0];
      console.log('user security policy data', this.securityPolicyData);
    });
  }
  onPasswordInput(event: Event): void {
    const target = event.target as HTMLInputElement;
  
    // Remove spaces from the current value
    const sanitizedValue = target.value.replace(/\s/g, '');
  
    // Update the target value and the newPassword property
    target.value = sanitizedValue; 
    this.newPassword = sanitizedValue; // Update the password value
  
    this.checkPasswordStrength(); // Call the function to check the strength of the password
  }

  onConfirmPasswordKeyDown(event: KeyboardEvent): void {
    // Capture current input value
    const target = event.target as HTMLInputElement;
    setTimeout(() => {
      this.confirmPassword = target.value; // Get the updated password after keydown
      this.validateConfirmPassword(); // Call the function to check the strength of the password
    }, 0);
  }


  // Function to check if the password meets all security requirements
  checkPasswordStrength(): boolean {
    if (!this.securityPolicyData) return false;

    return this.checkNumbers() && this.checkUppercase() && this.checkLowercase() &&
           this.checkSpecialCharacters() && this.checkMinimumLength();
  }

  validateConfirmPassword(): void {
    // Validate if confirmPassword matches newPassword
    if (this.confirmPassword === this.newPassword) {
      this.confirmPasswordBorderColor = '2px solid green'; // Set border color to green
    } else {
      this.confirmPasswordBorderColor = '2px solid red'; // Set border color to red
    }
  }

  checkNumbers(): boolean {
    return this.securityPolicyData.Numbers ? /\d/.test(this.newPassword) : true;
  }

  checkUppercase(): boolean {
    return this.securityPolicyData.UppercaseCharacters ? /[A-Z]/.test(this.newPassword) : true;
  }

  checkLowercase(): boolean {
    return this.securityPolicyData.LowercaseCharacters ? /[a-z]/.test(this.newPassword) : true;
  }

  checkSpecialCharacters(): boolean {
    return this.securityPolicyData.SpecialCharacters ? /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword) : true;
  }

  checkMinimumLength(): boolean {
    return this.newPassword.length >= this.securityPolicyData.MinimumLength;
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxTextBoxModule,
    FormPopupModule,
    DxValidatorModule,
    DxValidationGroupModule
  ],
  providers: [],
  exports: [],
  declarations: [ChangePasswordComponent],
})
export class ChangePasswordModule {}
