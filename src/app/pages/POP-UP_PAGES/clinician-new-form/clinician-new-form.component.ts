import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DxFormModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxValidatorModule,
  DxRadioGroupModule,
} from 'devextreme-angular';
import { FormTextboxModule, FormPhotoUploaderModule } from 'src/app/components';
import { MasterReportService } from '../../MASTER PAGES/master-report.service';

@Component({
  selector: 'app-clinician-new-form',
  templateUrl: './clinician-new-form.component.html',
  styleUrls: ['./clinician-new-form.component.scss'],
})
export class ClinicianNewFormComponent {
  newClinicianData = {
    iD: '',
    ClinicianLicense: '',
    ClinicianName: '',
    ClinicianShortName: '',
    SpecialityID: '',
    MajorID: '',
    ProfessionID: '',
    CategoryID: '',
    Gender: '',
  };

  newClinician = this.newClinicianData;
  Denial_Type_DropDownData: any;
  Denial_Category_DropDownData: any;
  specialityDatasource: any;
  clinicianMajorDatasource: any;
  clinicianProfessionDatasource: any;
  clinicianCategoryDatasource: any;
  genderDatasource: any;

  constructor(private masterService: MasterReportService) {
    this.get_DropDown_Data()
  }

  getnewClinicianData = () => ({ ...this.newClinician });

  reset_newClinicianFormData() {
    this.newClinician.ClinicianLicense = '';
    this.newClinician.ClinicianName = '';
    this.newClinician.ClinicianShortName = '';
    this.newClinician.SpecialityID = '';
    this.newClinician.MajorID='',
    this.newClinician.ProfessionID = '';
    this.newClinician.CategoryID = '';
    this.newClinician.Gender = '';
  }
  
  get_DropDown_Data() {
    this.masterService
      .Get_GropDown('SPECIALITY')
      .subscribe((response: any) => {
        this.specialityDatasource = response;
      });

      this.masterService
      .Get_GropDown('CLINICIANMAJOR')
      .subscribe((response: any) => {
        this.clinicianMajorDatasource = response;
      });

      this.masterService
      .Get_GropDown('CLINICIANPROFESSION')
      .subscribe((response: any) => {
        this.clinicianProfessionDatasource = response;
      });

      this.masterService
      .Get_GropDown('CLINICIANCATEGORY')
      .subscribe((response: any) => {
        this.clinicianCategoryDatasource = response;
      });

      this.masterService
      .Get_GropDown('GENDER')
      .subscribe((response: any) => {
        this.genderDatasource = response;
      });
      
  }
}

@NgModule({
  imports: [
    DxTextBoxModule,
    DxFormModule,
    DxValidatorModule,
    FormTextboxModule,
    FormPhotoUploaderModule,
    CommonModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxRadioGroupModule,
  ],
  declarations: [ClinicianNewFormComponent],
  exports: [ClinicianNewFormComponent],
})
export class ClinicianNewFormModule {}
