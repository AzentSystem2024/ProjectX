import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgModule,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
  
  
} from 'devextreme-angular';
import { MasterReportService } from '../../MASTER PAGES/master-report.service';
import { FormTextboxModule } from 'src/app/components';
import { BrowserModule } from '@angular/platform-browser';
import CountryList from 'country-list-with-dial-code-and-flag';

@Component({
  selector: 'app-user-new-form',
  templateUrl: './user-new-form.component.html',
  styleUrls: ['./user-new-form.component.scss'],
  providers:[MasterReportService,ReactiveFormsModule]
})
export class UserNewFormComponent implements OnInit,AfterViewChecked {

  @ViewChild('fileUploader', { static: false }) fileUploader!: DxFileUploaderComponent; // Update the type here
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
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
    changePasswordOnLogin:false,
    user_facility: []
  };
  newUserData = this.userData;
  getNewUserData = () => ({ ...this.newUserData });

  selectedRows:any[]=[];
  userForm: FormGroup;
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
  totalRowCount: number = 0;
  userList:any;
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

  constructor(private service:MasterReportService,private cdr: ChangeDetectorRef){
    
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();  // Triggers change detection
  }

  onDateOfBirthChange(event: any) {
    this.newUserData.DateofBirth = event.value; // Update the model with the selected date
  }
  onLoginExpiryDateChange(event: any) {
    this.newUserData.LoginExpiryDate = event.value; // Update the model with the selected date
  }
  onLockDateFromChange(event: any) {
    this.newUserData.LockDateFrom = event.value; // Update the model with the selected date
  }
  onLockDateToChange(event: any) {
    this.newUserData.LockDateTo = event.value; // Update the model with the selected date
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

checkLoginNameExists= (e: any): boolean => {
    const loginName = e.value;
    const exists = this.userList.some(user => user.LoginName === loginName);
  
    // Return true if it does NOT exist, false if it DOES exist
    e.valid = !exists;
    return e.valid;
}

  onUserNameInput(event: Event): void {
    const target = event.target as HTMLInputElement;
  
    // Regular expression to allow only alphabets with a single space between words
    let sanitizedValue = target.value
      .replace(/[^a-zA-Z\s]/g, '') // Remove all characters except alphabets and spaces
      .replace(/\s{2,}/g, ' ')     // Replace multiple spaces with a single space
      .replace(/^\s+/g, '')    // Remove spaces at the beginning of the string
      .toUpperCase(); 
  
    target.value = sanitizedValue; 
    this.newUserData.UserName = sanitizedValue; // Update the UserName value
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
  const exists = this.userList.some(user => user.Email.toLowerCase() === email.toLowerCase());

  // Return true if it does NOT exist, false if it DOES exist
  e.valid = !exists;
  return e.valid;
}

// Email format validation using custom regex (only alphanumerics before @)
customEmailValidation = (e: any): boolean => {
  const email = e.value;

  // Custom regex: only alphanumeric before @, at least one alphabet, followed by valid domain
  const emailPattern = /^[a-zA-Z0-9]+[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validate email against the custom pattern
  const isValid = emailPattern.test(email);

  e.valid = isValid;
  return e.valid;
}

  // Function to handle selection changes
  onSelectionChanged(e: any) {
    // Map selected row keys to the desired format
    this.userData.user_facility = e.selectedRowKeys.map((key: number) => ({      // Generate an ID for each entry starting from 1
      FacilityID: key        // Assign the selected FacilityID
    }));
    console.log('User Facility:', this.userData.user_facility);
    this.selectedRowCount = e.selectedRowKeys.length;
  }

  // checkLoginNameAvailability = (params: any) => {
  //   return new Promise((resolve) => {
  //     // Call your API to check if the login name exists
  //     this.service.getUserSecurityPolicityData()
  //       .subscribe(
  //         (response: any) => {

  //           // If the API returns true (exists), reject the validation
  //           if (response.exists) {
  //             resolve({ isValid: false, message: 'Login Name already exists' });
  //           } else {
  //             // If the login name does not exist, resolve the validation
  //             resolve({ isValid: true });
  //           }
  //         },
  //         (error) => {
  //           console.error('Error checking login name availability', error);
  //           resolve({ isValid: false, message: 'Error checking login name' });
  //         }
  //       );
  //   });
  // };

  onSubmit(){
    console.log('userform data',this.userForm)
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
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.readFile(file);
      this.resetFileInput(); // Reset the file input after selecting a file
    }
  }

  // Function to reset the file input
resetFileInput() {
  if (this.fileInput && this.fileInput.nativeElement) {
    this.fileInput.nativeElement.value = ''; // Reset the file input value
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

  // readFile(file: File) {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     // Read the file as an ArrayBuffer (binary format)
  //     const arrayBuffer = reader.result as ArrayBuffer;
      
  //     // Directly store the ArrayBuffer or its binary representation into the newUserData object
  //     this.newUserData.PhotoFile = arrayBuffer; // Storing as ArrayBuffer for binary data
      
  //     console.log(this.newUserData.PhotoFile, "Binary Data Ready to be Sent to DB");
  
  //     // Optionally, display the image using URL.createObjectURL for gallery purposes
  //     const imageUrl = URL.createObjectURL(new Blob([arrayBuffer]));
  //     this.images.push(imageUrl); // Add the image URL to the gallery for display
  //   };
  
  //   // Read the file as an ArrayBuffer to get binary data
  //   reader.readAsArrayBuffer(file);
  // }

  previewFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        this.images.push(reader.result);
      }
    };
  }
  removeImage(index: number) {
    // Remove image logic
    this.images.splice(index, 1);
    // Clear PhotoFile if the last image is removed
    if (this.images.length === 0) {
      this.newUserData.PhotoFile = '';
    }
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

  

  ngOnInit(): void {
    this.getDropDownData('GENDER_DATA');
    this.getDropDownData('USER_ROLE');
    this.getUserSecurityPolicyData();
    this.getFacilityData();
    this.getCountryCodeList();
    
    this.setDefaultCountryCode();
    this.updateMobileNumber(); // Update mobile field with the default country code
    this.getUSerData();
  
  }

  setDefaultCountryCode() {
    const defaultCountryCode = '+971'; // Default country code
    const defaultCountry = this.countryCodes.find(
      (code) => code.data.dial_code === defaultCountryCode
    );

    if (defaultCountry) {
      this.newUserData.countryCode = defaultCountry.data.dial_code; // Set the country code
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
      this.generatedPassword = this.generateRandomPassword();
    })
  }
  getFacilityData(){
    this.service.Get_Facility_List_Data().subscribe((res:any)=>{
      this.facilityList=res.data;
      console.log('facility data',this.facilityList)
    })
  }
  generateRandomPassword(): string {
    // Fetch the minimum length from security policy; default to 8 if not provided
    const minLength = Math.max(this.securityPolicyData.MinimumLength || 8, 8); // Ensure a minimum length of at least 8
  
    // Set a maximum length (e.g., 12) or based on your requirement
    const maxLength = 12;
  
    // Calculate random length between minLength and maxLength
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  
    const specialChars = "@#$%&*";
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
  
    // Initialize password and characters array
    let password = '';
    const characters = [];
    const requiredCharacters = [];
  
    // Include character sets and ensure at least one character from each selected set
    if (this.securityPolicyData.Numbers) {
      characters.push(numbers);
      requiredCharacters.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
    }
    if (this.securityPolicyData.UppercaseCharacters) {
      characters.push(upperCase);
      requiredCharacters.push(upperCase.charAt(Math.floor(Math.random() * upperCase.length)));
    }
    if (this.securityPolicyData.LowercaseCharacters) {
      characters.push(lowerCase);
      requiredCharacters.push(lowerCase.charAt(Math.floor(Math.random() * lowerCase.length)));
    }
    if (this.securityPolicyData.SpecialCharacters) {
      characters.push(specialChars);
      requiredCharacters.push(specialChars.charAt(Math.floor(Math.random() * specialChars.length)));
    }
  
    // Ensure there are character sets to choose from
    if (characters.length === 0) {
      throw new Error('No character sets selected based on the security policy.');
    }
  
    // Add at least one character of each required type to the password
    requiredCharacters.forEach(char => password += char);
  
    // Calculate remaining length to fill
    const remainingLength = length - requiredCharacters.length;
  
    // Fill the rest of the password with random characters from the selected sets
    for (let i = 0; i < remainingLength; i++) {
      const charSet = characters[Math.floor(Math.random() * characters.length)];
      password += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
  
    // Shuffle the password to ensure randomness
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
  
    return password;
  }

  refreshPassword(): void {
    this.generatedPassword = this.generateRandomPassword(); // Call your existing method to generate a random password
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
  
  

  copyToClipboard(): void {
    if (!navigator.clipboard) {
      console.warn('Clipboard API not available. Make sure you are running the application over HTTPS.');
      // Optionally show a user-friendly message or fallback logic
      this.tooltipVisible = false; 
      return;
    }
  
    navigator.clipboard.writeText(this.generatedPassword).then(() => {
      this.tooltipVisible = true;
      console.log('Password copied to clipboard');
    }).catch(err => {
      console.error('Error copying password to clipboard', err);
      // You can show an error message to the user here
    });
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
   
  ],
  providers: [],
  declarations: [UserNewFormComponent],
  exports: [UserNewFormComponent],
})
export class UserNewFormModule {}
