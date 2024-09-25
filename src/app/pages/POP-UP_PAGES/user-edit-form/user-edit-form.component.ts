import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import notify from 'devextreme/ui/notify';
import {
  DxTabPanelModule,
  DxCheckBoxModule,
  DxSelectBoxModule,
  DxTemplateModule,
  DxTabsModule,
  DxTextBoxModule,
  DxButtonModule,
  DxDataGridModule,
  DxTreeViewModule,
  DxValidatorModule,
  DxValidatorComponent,
  DxValidationSummaryModule,
  DxRadioGroupModule,
  DxDateBoxModule,
  DxFileUploaderModule,
  DxProgressBarModule,
  DxFileUploaderComponent,
  DxTooltipModule,
  DxValidationGroupModule,
  DxNumberBoxModule,
  DxValidationGroupComponent,
  DxPopupModule,
  
  
} from 'devextreme-angular';
import { MasterReportService } from '../../MASTER PAGES/master-report.service';
import { FormTextboxModule } from 'src/app/components';
import { BrowserModule } from '@angular/platform-browser';
import CountryList from 'country-list-with-dial-code-and-flag';
import { UserComponent } from '../../MASTER PAGES/user/user.component';
import { ResetPasswordComponent,ResetPasswordModule } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-user-edit-form',
  templateUrl: './user-edit-form.component.html',
  styleUrls: ['./user-edit-form.component.scss']
})
export class UserEditFormComponent implements OnInit,OnChanges {
  @ViewChild('validationGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild(UserEditFormComponent) editform: UserEditFormComponent;
  @ViewChild(UserComponent) list: UserComponent;

  @Input() formdata: any;

  @Output() closeForm = new EventEmitter();

  selectedRows:any[]=[];
  resetConfirmationVisible = false;
  resetFormVisible = false;
  UserID:any;
  popupToolbarItems = [
    {
      widget: 'dxButton',
      location: 'after',
      options: {
        onClick: () => this.resetConfirmationVisible = false
      }
    }
  ];
  PhotoFile:any;

  userData:any = {
    UserName: '',
    Password: '',
    DateofBirth: '',
    UserRoleID:'',
    Whatsapp: '',
    LoginName:'',
    GenderID:'',
    Email:'',
    Mobile:'',
    countryCode:'',
    IsInactive:false,
    InactiveReason:'',
    IsLocked:false,
    LockDateFrom:'',
    LockDateTo: '',
    LoginExpiryDate : '',
    PhotoFile:'',
    user_facility: [],
    
  };

  newUserData = this.userData;
  getNewUserData = () => ({ ...this.newUserData });

  images: string[] = [];
  stylingMode: any = 'primary';
  iconPosition: any = 'left';
  orientations: any = 'horizontal';
  scrollByContent: boolean = true;
  showNavButtons: boolean = true;
  isPasswordVisible = false;
  securityPolicyData:any;
  facilityList
  countryCodes: any[] = [];

  isDropZoneActive = false;
  imageSource = '';
  textVisible = true;
  progressVisible = false;
  progressValue = 0;
  allowedFileExtensions: string[] = ['.jpg', '.jpeg', '.gif', '.png'];
  selectedIndex: number = 0; // Default to the first tab (User)
  generatedPassword: string = '';
  tooltipVisible = false;
  onShowEvent = 'click';
  onHideEvent = 'click';
  selectedRowCount: number = 0; 
  // Method to handle tab click and set selected index
  onTabClick(event: any) {
    console.log(event);
    this.selectedIndex = event.itemIndex;
  }

  // Radio button options
  userTypes = ['Normal User', 'Clinician'];
  gender: any;
  userRole: any;
  clinicianOptions = ['clinician1', 'clinician2', 'clinician3'];
  isLocked: boolean = false;
  isInactive:boolean=false;
  showUserDetails: boolean = true; // Show User Details by default
  showOptions: boolean = true;     // Show Options by default
  selectedUserType: string = this.userTypes[0]; // Default to 'Normal User'
  userList:any;
  tabItems = [
    { text: 'Facility' },
    { text: 'Options' }
  ];
  facilityData = [
    { license: 'F12345', facility: 'Facility 1' },
    { license: 'F67890', facility: 'Facility 2' },
    { license: 'F54321', facility: 'Facility 3' }
  ];

  facilityColumns = [
    { dataField: 'license', caption: 'Facility License' },
    { dataField: 'facility', caption: 'Facility' }
  ];

  public isDropdownOpen: boolean = false;
  currentLoginName:any;
  currentEmail:any;

  constructor(private service:MasterReportService,private cdr: ChangeDetectorRef){ 
  }

  getUSerData(){
    this.service.get_User_data().subscribe(data=>{
      this.userList=data;
      console.log('datasource',this.userList);
    })
  }

  onLoginNameInput(event: Event): void {
    const target = event.target as HTMLInputElement;

    // Remove spaces from the current value and sanitize it
    const sanitizedValue = target.value.replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '');

    // Check if the first character is an alphabet
    if (sanitizedValue.length > 0 && /^[a-zA-Z]/.test(sanitizedValue[0])) {
        // Update the target value and the LoginName property
        target.value = sanitizedValue; 
        this.newUserData.LoginName = sanitizedValue; // Update the login name value

        // Validate the login name directly
        this.checkLoginNameExists({ value: sanitizedValue });
    } else {
        // If the first character is not an alphabet, reset the input
        target.value = ''; // Optionally clear the input
        this.newUserData.LoginName = ''; // Reset the login name value
    }
}

checkLoginNameExists = (e: any): boolean => {
  const loginName = e.value;


  // Check if the login name exists in the user list, excluding the current one
  const exists = this.userList.some(user => user.LoginName === loginName && user.LoginName !== this.currentLoginName);

  // Return true if it does NOT exist, false if it DOES exist
  e.valid = !exists;

  // Optional: You can also provide feedback to the user here if needed
  if (!e.valid) {
      // Logic to show a message indicating the login name already exists
      console.log('Login name already exists.');
  }

  return e.valid;
}

// This function removes spaces from the email input and updates the Email property
onEmailInput(event: Event): void {
  const target = event.target as HTMLInputElement;

  // Remove spaces from the email input
  const sanitizedValue = target.value.replace(/\s/g, '');

  // Update the target value and the Email property
  target.value = sanitizedValue;
  this.newUserData.Email = sanitizedValue;
  this.checkEmailExists({ value: sanitizedValue });
}

// This function checks if the email already exists in the user list
checkEmailExists=(e: any): boolean => {
  const email = e.value;
  
  // Check if the email already exists in the user list
  const exists = this.userList.some(user => (user.Email.toLowerCase() === email.toLowerCase()) && user.Email!==this.currentEmail);

  // Return true if it does NOT exist, false if it DOES exist
  e.valid = !exists;
  return e.valid;
}

  // Function to handle selection changes
  onSelectionChanged(e: any) {
    // Map selected row keys to the desired format
    this.newUserData.user_facility = e.selectedRowKeys.map((key: number) => ({      // Generate an ID for each entry starting from 1
      FacilityID: key        // Assign the selected FacilityID
    }));
    console.log('User Facility:', this.userData.user_facility);
    this.selectedRowCount = e.selectedRowKeys.length;

    this.cdr.detectChanges();
  }

  onSubmit(){
    console.log('userform data')
  }

  toggleUserDetails(): void {
    this.showUserDetails = !this.showUserDetails;
  }

  toggleOptions(): void {
    this.showOptions = !this.showOptions;
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible; // Toggle the visibility flag
  }

  preventDefaults(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragEnter(e: Event) {
    this.preventDefaults(e);
    (e.target as HTMLElement).classList.add('highlight');
  }

  handleDragLeave(e: Event) {
    this.preventDefaults(e);
    (e.target as HTMLElement).classList.remove('highlight');
  }

  handleDrop(event: DragEvent) {
    this.preventDefaults(event);
    if (event.dataTransfer && event.dataTransfer.files) {
      const file = event.dataTransfer.files[0];
      this.readFile(file);
    }
  }

  handleFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.readFile(file);
    }
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.newUserData.PhotoFile = result;
      this.images.push(result); // Add the base64 image to the gallery
    };
    reader.readAsDataURL(file); // Read the file as a base64 string
  }

  previewFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        this.images.push(reader.result);
      }
    };
  }
  
  getCountryCodeList() {
    const codes = CountryList.getAll(); // Get all country codes
    this.countryCodes = codes.map((country: any) => ({
      data: country.data
    }));
    console.log(this.countryCodes, 'country code'); // Optional: For debugging
  }

  // Use this function to display based on dropdown state
  countryCodeDisplay = (item: any) => {
    return item ? (this.isDropdownOpen 
                   ? `${item.data.flag} ${item.data.dial_code} - ${item.data.name}` 
                   : `${item.data.flag}`) : '';  // Display only country flag before dropdown is opened
  };

  // Triggered when the dropdown is opened
  onDropdownOpened() {
    this.isDropdownOpen = true;  // Mark dropdown as open
  }

  // Triggered when the dropdown is closed
  onDropdownClosed() {
    this.isDropdownOpen = false;  // Mark dropdown as closed
  }

  extractCountryCode(mobileNumber: string): string | null {
    // Extract the dial code from the mobile number
    const dialCode = this.countryCodes.find(code => mobileNumber.startsWith(code.data.dial_code));
    return dialCode ? dialCode.data.dial_code : null;
  }

  updateMobileNumber() {
    // Find the selected country code
    const selectedCountry = this.countryCodes.find(
      (code) => code.data.dial_code === this.newUserData.countryCode
    );
  
    if (selectedCountry) {
      const dialCode = selectedCountry.data.dial_code; // Extract country code
  
      // Extract and validate the mobile number part
      const mobileNumber = this.getOnlyMobileNumber(this.newUserData.Mobile);
      const validMobileNumber = this.validateMobileNumber(mobileNumber);
  
      // Update the mobile field with valid country code and mobile number
      this.newUserData.Mobile = `${dialCode} ${validMobileNumber}`;
      
      console.log('Updated Mobile:', this.newUserData.Mobile); // For debugging
    }
  }
  
  getOnlyMobileNumber(fullPhoneNumber: string): string {
    // Extract mobile number by removing the dial code part
    const selectedCountry = this.countryCodes.find(
      (code) => fullPhoneNumber.startsWith(code.data.dial_code)
    );
  
    if (selectedCountry) {
      return fullPhoneNumber.replace(selectedCountry.data.dial_code, '').trim();
    }
  
    return fullPhoneNumber; // Return as is if no match found
  }
  

  onMobileInputChange(event: any) {
    const newValue = event.value;
  
    // Find the selected country code
    const selectedCountry = this.countryCodes.find(
      (code) => code.data.dial_code === this.newUserData.countryCode
    );
  
    if (selectedCountry) {
      const dialCode = selectedCountry.data.dial_code;
  
      // If the user tries to backspace to remove the dial code, reset the input
      if (!newValue.startsWith(dialCode)) {
        this.newUserData.Mobile = dialCode; // Reset mobile number to only show dial code
        return;
      }
  
      // Extract the mobile number part
      const mobileNumberPart = newValue.replace(dialCode, '').trim();
      const validMobileNumber = this.validateMobileNumber(mobileNumberPart);
  
      // Update the mobile field, keeping the dial code intact
      this.newUserData.Mobile = `${dialCode} ${validMobileNumber}`;
    }
  }

  validateMobileNumber(mobileNumber: string): string {
    // Remove any non-digit characters
    const digitsOnly = mobileNumber.replace(/\D/g, '');
  
    // Ensure the number does not start with zero and return valid number or empty string if invalid
    return digitsOnly.startsWith('0') ? '' : digitsOnly;
  }

  MobileNumberValidate=(e: any): boolean => {
    const mobileNumber = e.value;
  
    // Remove all non-digit characters
    const sanitizedNumber = mobileNumber.replace(/\D/g, '');
  
    // Check if the sanitized number has at least 10 digits
    if (sanitizedNumber.length >= 10) {
      return true; // Valid
    }
    return false; // Invalid
  }

  WhatsappValidate=(e: any): boolean => {
    const whatsappNumber = e.value;
  
    // Remove all non-digit characters
    const sanitizedNumber = whatsappNumber.replace(/\D/g, '');
  
    // Check if the sanitized number has at least 10 digits
    if (sanitizedNumber.length >= 10) {
      return true; // Valid
    }
    return false; // Invalid
  }

  validateWhatsapp(event: any) {
    const target = event.target as HTMLInputElement;

  // Allow only input that starts with '+' and contains only digits
  const sanitizedValue = target.value.replace(/[^0-9+]/g, '');

  // Ensure the '+' is only at the start
  if (sanitizedValue.indexOf('+') > 0) {
    target.value = '+' + sanitizedValue.replace(/\+/g, '');
  } else {
    target.value = sanitizedValue;
  }

  // Update the WhatsApp property with the sanitized value
  this.newUserData.Whatsapp = target.value;
  }

  autoBindWhatsapp() {
    console.log('WhatsApp field focused.');
    setTimeout(() => {
      if (!this.newUserData.Whatsapp && this.newUserData.Mobile) {
        console.log('Populating WhatsApp with Mobile:', this.newUserData.Mobile);
        this.newUserData.Whatsapp = this.newUserData.Mobile;
      }
    }, 0);
  }

  ngOnInit(): void {
    this.getDropDownData('GENDER_DATA');
    this.getDropDownData('USER_ROLE');
    this.getUserSecurityPolicyData();
    this.getFacilityData();
    this.getCountryCodeList();
    this.getUSerData();

    // Pre-fill country code field based on mobile number
  if (this.newUserData.Mobile) {
    const dialCode = this.extractCountryCode(this.newUserData.Mobile);
    if (dialCode) {
      this.newUserData.countryCode = dialCode;
    }
  }
  }

  getDropDownData(data:any){
    this.service.Get_GropDown(data).subscribe(res=>{
      console.log(res,"res");
      if(data==='GENDER_DATA')
      {
       this.gender=res;
        console.log("gender",this.gender)
      }
      if(data==='USER_ROLE'){
        this.userRole=res;
        console.log(this.userRole,'userRole')
      }
    })
  }
  getUserSecurityPolicyData(){
    this.service.getUserSecurityPolicityData().subscribe((res:any)=>{
      this.securityPolicyData = res.data[0];
      console.log('user security policy data',this.securityPolicyData)
      // this.generatedPassword = this.generateRandomPassword();
    })
  }
  getFacilityData(){
    this.service.Get_Facility_List_Data().subscribe((res:any)=>{
      this.facilityList=res.data;
      console.log('facility data',this.facilityList)
    })
  }

  resetPassword(){
    this.resetConfirmationVisible = true;
  }
  cancelReset() {
    this.resetConfirmationVisible = false;
  }
  confirmReset() {
    this.resetFormVisible=true;
    this.resetConfirmationVisible = false;
  }

  CloseResetPasswordForm(){
    this.resetFormVisible=false;
  }

  onSaveClick(){

    const validationResult = this.validationGroup.instance.validate();

    // Check if the form is valid before proceeding
    if (!validationResult.isValid) {
      return; // Stop execution if form is not valid; error messages will be shown next to the fields
    }
    
    console.log(this.newUserData,"edit form data");
    console.log(this.userData.user_facility,"userfacility")
    this.service.update_User_Data(this.newUserData).subscribe((res:any)=>{
      try {
        if(res.message==='Success')
        {
        notify(
          {
            message: 'data updated successfully',
            position: { at: 'top right', my: 'top right' },
            displayTime: 500,
          },
          'success'
        );
        this.close();
      }
      else{
        notify(
          {
            message: 'An unexpected error occurred',
            position: { at: 'top right', my: 'top right' },
            displayTime: 500,
          },
          'error'
        );
      }
      } catch (error) {
        notify(
          {
            message: 'update operation failed',
            position: { at: 'top right', my: 'top right' },
            displayTime: 500,
          },
          'error'
        );
      }
    })
  }
  close(){
    this.closeForm.emit();
  }




  ngOnChanges(changes: SimpleChanges) {
    if (changes.formdata && changes.formdata.currentValue) {
      console.log(this.formdata, "..............");
      this.UserID=this.formdata.UserID;
      this.currentLoginName=this.formdata.LoginName;
      this.currentEmail=this.formdata.Email;
      console.log(this.UserID,"userid")
      this.newUserData = { ...this.formdata };
      this.images=this.newUserData.PhotoFile;
      console.log(this.images,"photo")

      // Extract country code from mobile number
      const extractedCountryCode = this.extractCountryCode(this.newUserData.Mobile);
      if (extractedCountryCode) {
        this.newUserData.countryCode = extractedCountryCode;
      }

      this.selectedRows = this.facilityList
      .filter(column => this.newUserData.user_facility.some(facility => facility.FacilityID === column.ID))
      .map(column => column.ID);

      // this.facilityList = [
      //   // Selected facilities first
      //   ...this.facilityList.filter(facility => this.selectedRows.includes(facility.ID)),
      //   // Non-selected facilities after
      //   ...this.facilityList.filter(facility => !this.selectedRows.includes(facility.ID))
      // ];
    }
    // Reorder facilityList based on selectedRows   
  
    this.cdr.detectChanges();
    
    
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxTabPanelModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxTemplateModule,
    DxTabsModule,
    DxTextBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxTreeViewModule,
    DxValidatorModule,
    DxRadioGroupModule,
    FormTextboxModule,
    DxDateBoxModule,
    DxFileUploaderModule,
    DxProgressBarModule,
    BrowserModule,
    DxTooltipModule,
    ReactiveFormsModule,
    DxValidationGroupModule,
    DxNumberBoxModule,
    DxPopupModule,
    ResetPasswordModule
    
  ],
  providers: [],
  declarations: [UserEditFormComponent],
  exports: [UserEditFormComponent],
})
export class UserEditFormModule {}

