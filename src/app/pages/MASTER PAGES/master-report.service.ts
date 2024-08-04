import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseURL } from '../../services/constant-url.service';

const BASE_URL = BaseURL;
const Token = JSON.parse(localStorage.getItem('Token'));

const gender: any = [
  { description: 'Male' },
  { description: 'Female' },
  { description: 'Others' },
];
const tabPanelItems: any = [
  {
    icon: 'description',
    text: 'Reports',
    menus: [
      {
        status: 'Not Started',
        priority: 'medium',
        text: 'Training',
        date: '2023/09/16',
        assignedBy: 'Arthur Miller',
      },
      {
        status: 'Not Started',
        priority: 'medium',
        text: 'NDA',
        date: '2023/09/16',
        assignedBy: 'Robert Reagan',
      },
      {
        status: 'Not Started',
        priority: 'low',
        text: 'Health Insurance',
        date: '2023/09/16',
        assignedBy: 'Greta Sims',
      },
    ],
  },
  {
    icon: 'taskhelpneeded',
    text: 'Activity',
    menus: [
      {
        status: 'Help Needed',
        priority: 'low',
        text: 'Recall and Refund Forms',
        date: '2023/09/16',
        assignedBy: 'Sandra Johnson',
      },
      {
        status: 'Help Needed',
        priority: 'high',
        text: 'Shippers',
        date: '2023/09/16',
        assignedBy: 'Ed Holmes',
      },
      {
        status: 'Help Needed',
        priority: 'medium',
        text: 'Hardware Upgrade',
        date: '2023/09/16',
        assignedBy: 'Barb Banks',
      },
    ],
  },
  {
    icon: 'taskinprogress',
    text: 'Masters',
    menus: [
      {
        status: 'In Progress',
        priority: 'low',
        text: 'Bandwidth Increase',
        date: '2023/09/16',
        assignedBy: 'Davey Jones',
      },
      {
        status: 'In Progress',
        priority: 'medium',
        text: 'Support',
        date: '2023/09/16',
        assignedBy: 'Victor Norris',
      },
      {
        status: 'In Progress',
        priority: 'low',
        text: 'Training Material',
        date: '2023/09/16',
        assignedBy: 'John Heart',
      },
    ],
  },
  {
    icon: 'taskstop',
    text: 'ERX',
    menus: [
      {
        status: 'Deferred',
        priority: 'high',
        text: 'Automation Server',
        date: '2023/09/16',
        assignedBy: 'Arthur Miller',
      },
      {
        status: 'Deferred',
        priority: 'medium',
        text: 'Retail Sales',
        date: '2023/09/16',
        assignedBy: 'Robert Reagan',
      },
      {
        status: 'Deferred',
        priority: 'medium',
        text: 'Shipping Labels',
        date: '2023/09/16',
        assignedBy: 'Greta Sims',
      },
    ],
  },
  {
    icon: 'taskrejected',
    text: 'System',
    menus: [
      {
        status: 'Rejected',
        priority: 'high',
        text: 'Schedule Meeting with Sales Team',
        date: '2023/09/16',
        assignedBy: 'Sandra Johnson',
      },
      {
        status: 'Rejected',
        priority: 'medium',
        text: 'Confirm Availability for Sales Meeting',
        date: '2023/09/16',
        assignedBy: 'Ed Holmes',
      },
      {
        status: 'Rejected',
        priority: 'medium',
        text: 'Reschedule Sales Team Meeting',
        date: '2023/09/16',
        assignedBy: 'Barb Banks',
      },
    ],
  },
];
@Injectable({
  providedIn: 'root',
})
export class MasterReportService {
  constructor(private http: HttpClient) {}

  //======Fetch gender data======
  get_gender_Data(): any {
    return gender;
  }

  //======Fetch tabPanelItems data======
  get_userLevel_Data(): any {
    return tabPanelItems;
  }
  //======Facility Drop down data=====================
  Get_GropDown(dropDownField: any) {
    const Url = `${BASE_URL}/dropdown`;
    const reqBody = { name: dropDownField };
    return this.http.post(Url, reqBody);
  }

  //==========================================INSURANCE MASTER==========================================================
  //====Insurance List===========
  get_Speciality_List() {
    const Url = `${BASE_URL}/speciality/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //=====Add Insurance data========
  Insert_Speciality_Data(
    SpecialityCode: any,
    SpecialityName: any,
    SpecialityShortName: any,
    Description: any
  ) {
    const url = `${BASE_URL}/speciality/insert`;
    const reqBody = {
      SpecialityCode: SpecialityCode,
      SpecialityName: SpecialityName,
      SpecialityShortName: SpecialityShortName,
      Description: Description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Update Insurance data======
  update_Speciality_data(
    id: any,
    SpecialityCode: any,
    SpecialityName: any,
    SpecialityShortName: any,
    Description: any
  ) {
    const url = `${BASE_URL}speciality/update`;
    const reqBody = {
      ID: id,
      SpecialityCode: SpecialityCode,
      SpecialityName: SpecialityName,
      SpecialityShortName: SpecialityShortName,
      Description: Description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Remove Insurance Data=====
  Remove_Speciality_Row_Data(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}speciality/delete/${id}`, {});
  }

  //==========================================INSURANCE MASTER==========================================================
  //====Insurance List===========
  get_Insurance_List() {
    const Url = `${BASE_URL}/insurancecompany/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //=====Add Insurance data========
  Insert_Insurance_Data(
    InsuranceID: any,
    InsuranceName: any,
    InsuranceShortName: any
  ) {
    const url = `${BASE_URL}/insurancecompany/insert`;
    const reqBody = {
      InsuranceID: InsuranceID,
      InsuranceName: InsuranceName,
      InsuranceShortName: InsuranceShortName,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Update Insurance data======
  update_Insurance_data(
    id: any,
    InsuranceID: any,
    InsuranceName: any,
    InsuranceShortName: any
  ) {
    const url = `${BASE_URL}insurancecompany/update`;
    const reqBody = {
      ID: id,
      InsuranceID: InsuranceID,
      InsuranceName: InsuranceName,
      InsuranceShortName: InsuranceShortName,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Remove Insurance Data=====
  Remove_Insurance_Row_Data(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}insurancecompany/delete/${id}`, {});
  }

  //===================================================FACILITY====================================================
  //=======Fetch All facility data========
  Get_Facility_List_Data() {
    const Url = `${BASE_URL}/facility/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }

  //=====Update Facility data====
  update_facility_data(
    id: any,
    FacilityLicense: any,
    FacilityName: any,
    Region: any,
    FacilityTypeID: any,
    FacilityGroupID: any,
    FacilityAddress: any,
    PostOfficeID: any
  ) {
    const url = `${BASE_URL}/facility/update`;
    const reqBody = {
      ID: id,
      FacilityLicense: FacilityLicense,
      FacilityName: FacilityName,
      Region: Region,
      FacilityTypeID: FacilityTypeID,
      FacilityGroupID: FacilityGroupID,
      FacilityAddress: FacilityAddress,
      PostOfficeID: PostOfficeID,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Remove Facility Data=====
  Remove_Facility_Row_Data(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}speciality/delete/${id}`, {});
  }

  //================================================FACILITY TYPE=================================================
  //=====Fetch all Facility Type data======
  Get_Facility_Type_Data() {
    const Url = `${BASE_URL}/facilitytype/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //====Add facility Type data=======
  Insert_FacilityType_Data(FacilityType: any, description: any) {
    const url = `${BASE_URL}/facilitytype/insert`;
    const reqBody = {
      FacilityType: FacilityType,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //====Update Facility Type data====
  update_facilityTYPE_data(id: any, FacilityType: any, description: any) {
    const url = `${BASE_URL}/facilitytype/update`;
    const reqBody = {
      ID: id,
      FacilityType: FacilityType,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //====Remove Facility Type Data=========
  Remove_FacilityType_Row_Data(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}facilitytype/delete/${id}`, {});
  }

  //===================================================FACILITY GROUP============================================
  Get_Facility_Group_Data() {
    const Url = `${BASE_URL}/facilitygROUP/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //=====Add facility group data=====
  Insert_FacilityGroup_Data(facilitygroup: any, description: any) {
    const url = `${BASE_URL}/facilitygroup/insert`;
    const reqBody = {
      FacilityGroup: facilitygroup,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //=====Update Facility Group data====
  update_facilityGroup_data(id: any, facilitygroup: any, description: any) {
    const url = `${BASE_URL}/facilitygROUP/update`;
    const reqBody = {
      ID: id,
      FacilityGroup: facilitygroup,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //===Remove Facility Data==========
  Remove_Facility_Group_Data(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}facilitygroup/delete/${id}`, {});
  }

  //==========================================CPT MASTER==========================================================
  //======Cpt Master List===========
  get_CptMaster_List() {
    const Url = `${BASE_URL}/cptmaster/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //======Add Cpt Master data========
  Insert_CptMaster_Data(
    CPTTypeID: any,
    CPTCode: any,
    CPTShortName: any,
    CPTName: any,
    description: any
  ) {
    const url = `${BASE_URL}/cptmaster/insert`;
    const reqBody = {
      CPTTypeID: CPTTypeID,
      CPTCode: CPTCode,
      CPTShortName: CPTShortName,
      CPTName: CPTName,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Update Cpt Master data======
  update_CptMaster_data(
    id: any,
    CPTTypeID: any,
    CPTCode: any,
    CPTShortName: any,
    CPTName: any,
    description: any
  ) {
    const url = `${BASE_URL}/cptmaster/update`;
    const reqBody = {
      ID: id,
      CPTTypeID: CPTTypeID,
      CPTCode: CPTCode,
      CPTShortName: CPTShortName,
      CPTName: CPTName,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Remove Cpt Master Data==========
  Remove_CptMaster_Row_Data(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}cptmaster/delete/${id}`, {});
  }

  //==========================================CPY TYPE MASTER==========================================================
  //======Cpt type List===========
  get_CptType_List() {
    const Url = `${BASE_URL}/CPTtype/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //======Add Cpt type data========
  Insert_CptType_Data(CptType: any, description: any) {
    const url = `${BASE_URL}/CPTtype/insert`;
    const reqBody = {
      CptType: CptType,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Update Cpt type data======
  update_CptType_data(id: any, CptType: any, Description: any) {
    const url = `${BASE_URL}/CPTtype/update`;
    const reqBody = {
      ID: id,
      CptType: CptType,
      Description: Description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Remove Cpt type Data==========
  Remove_CPTType_Row_Data(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}CPTtype/delete/${id}`, {});
  }
  //==========================================Denia MASTER==========================================================

  //====================denials Fetching==================
  getDenialsData() {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post<any>(`${BASE_URL}DenialMaster/List`, {});
  }

  //====================Add Denials========================
  addDenial(
    DenialCode: any,
    Description: any,
    DenialTypeID: any,
    DenialCategoryID: any
  ) {
    const DenialAddData = {
      DenialCode,
      Description,
      DenialTypeID,
      DenialCategoryID,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}DenialMaster/Insert`, DenialAddData);
  }

  //------------update Denial--------------------------
  updateDenial(
    ID: any,
    DenialCode: any,
    Description: any,
    DenialTypeID: any,
    DenialCategoryID: any
  ) {
    const UpdateData = {
      ID,
      DenialCode,
      Description,
      DenialTypeID,
      DenialCategoryID,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}DenialMaster/Update`, UpdateData);
  }

  //================REmove Denial=========================
  removeDenial(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}DenialMaster/delete/${id}`, {});
  }
  //==========================================Denial TYPE MASTER==========================================================
  //======Denial type List===========
  get_DenialType_List() {
    const Url = `${BASE_URL}/denialtype/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //======Add Denial type data========
  Insert_DenialType_Data(DenialType: any, description: any) {
    const url = `${BASE_URL}/denialtype/insert`;
    const reqBody = {
      DenialType: DenialType,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Update Denial type data======
  update_DenialType_data(id: any, DenialType: any, Description: any) {
    const url = `${BASE_URL}/denialtype/update`;
    const reqBody = {
      ID: id,
      DenialType: DenialType,
      Description: Description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Remove Denial type Data==========
  Remove_DenialType_Row_Data(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}denialtype/delete/${id}`, {});
  }

  //==========================================Denial TYPE MASTER==========================================================
  //======Denial category List===========
  get_DenialCategory_List() {
    const Url = `${BASE_URL}/denialcategory/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //======Add Denial category data========
  Insert_DenialCategory_Data(DenialCategory: any, description: any) {
    const url = `${BASE_URL}/denialcategory/insert`;
    const reqBody = {
      DenialCategorys: DenialCategory,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Update Denial category data======
  update_DenialCategory_data(id: any, DenialCategory: any, Description: any) {
    const url = `${BASE_URL}/denialcategory/update`;
    const reqBody = {
      ID: id,
      DenialCategorys: DenialCategory,
      Description: Description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Remove Denial category Data==========
  Remove_DenialCategory_Row_Data(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}denialcategory/delete/${id}`, {});
  }
  //========================================================CLINICIAN=========================================================
  //===========Get all data list========
  get_Clinian_Table_Data() {
    const Url = `${BASE_URL}/clinician/list`;
    const reqBody = {
      list: [],
    };
    return this.http.post(Url, reqBody);
  }

  //=======insert data ==========
  Insert_Clinician_Data(
    ClinicianLicense: any,
    ClinicianName: any,
    ClinicianShortName: any,
    SpecialityID: any,
    MajorID: any,
    ProfessionID: any,
    CategoryID: any,
    Gender: any
  ) {
    const url = `${BASE_URL}/clinician/insert`;
    const reqBody = {
      ClinicianLicense: ClinicianLicense,
      ClinicianName: ClinicianName,
      ClinicianShortName: ClinicianShortName,
      SpecialityID: SpecialityID,
      MajorID: MajorID,
      ProfessionID: ProfessionID,
      CategoryID: CategoryID,
      Gender: Gender,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Update Denial category data======
  update_Clinician_data(
    id: any,
    ClinicianLicense: any,
    ClinicianName: any,
    ClinicianShortName: any,
    SpecialityID: any,
    MajorID: any,
    ProfessionID: any,
    CategoryID: any,
    Gender: any
  ) {
    const url = `${BASE_URL}/clinician/update`;
    const reqBody = {
      ID: id,
      ClinicianLicense: ClinicianLicense,
      ClinicianName: ClinicianName,
      ClinicianShortName: ClinicianShortName,
      SpecialityID: SpecialityID,
      MajorID: MajorID,
      ProfessionID: ProfessionID,
      CategoryID: CategoryID,
      Gender: Gender,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }

  //=====Remove Denial category Data==========
  Remove_Clinician_Row_Data(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}clinician/delete/${id}`, {});
  }

  //===================================================INSURANCE CLASSIFICATION============================================
  Get_InsuranceClassification_Data() {
    const Url = `${BASE_URL}/insuranceclassification/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //=====Add CLASSIFICATION data=====
  Insert_InsuranceClassification_Data(Classification: any, description: any) {
    const url = `${BASE_URL}/insuranceclassification/insert`;
    const reqBody = {
      Classification: Classification,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //=====Update CLASSIFICATION data====
  update_InsuranceClassification_data(
    id: any,
    Classification: any,
    description: any
  ) {
    const url = `${BASE_URL}/insuranceclassification/update`;
    const reqBody = {
      ID: id,
      Classification: Classification,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //===Remove CLASSIFICATION Data==========
  Remove_InsuranceClassification_Data(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(
      `${BASE_URL}insuranceclassification/delete/${id}`,
      {}
    );
  }

  //===================================================clinician profession============================================
  Get_ClinicianProfession_Data() {
    const Url = `${BASE_URL}/clinicianprofession/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //=====Add clinicianprofession data=====
  Insert_ClinicianProfession_Data(Profession: any, description: any) {
    const url = `${BASE_URL}/clinicianprofession/insert`;
    const reqBody = {
      Profession: Profession,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //=====Update clinicianprofession data====
  update_ClinicianProfession_data(id: any, Profession: any, description: any) {
    const url = `${BASE_URL}/clinicianprofession/update`;
    const reqBody = {
      ID: id,
      Profession: Profession,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //===Remove clinician profession Data==========
  remove_ClinicianProfession(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}clinicianprofession/delete/${id}`, {});
  }

  //===================================================clinician Major============================================
  Get_ClinicianMajor_Data() {
    const Url = `${BASE_URL}/clinicianmajor/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //=====Add clinician Major data=====
  Insert_ClinicianMajor_Data(Major: any, description: any) {
    const url = `${BASE_URL}/clinicianmajor/insert`;
    const reqBody = {
      Major: Major,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //=====Update clinician Major data====
  update_ClinicianMajor_data(id: any, Major: any, description: any) {
    const url = `${BASE_URL}/clinicianmajor/update`;
    const reqBody = {
      ID: id,
      Major: Major,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //===Remove clinicianMajor Data==========
  remove_ClinicianMajor(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}clinicianmajor/delete/${id}`, {});
  }

  //===================================================clinician Category============================================
  Get_ClinicianCategory_Data() {
    const Url = `${BASE_URL}/cliniciancategory/list`;
    const reqBody = {
      list: [],
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(Url, reqBody);
  }
  //=====Add clinician Category data=====
  Insert_ClinicianCategory_Data(Category: any, description: any) {
    const url = `${BASE_URL}/cliniciancategory/insert`;
    const reqBody = {
      Category: Category,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //=====Update clinician category data====
  update_ClinicianCategory_data(id: any, Category: any, description: any) {
    const url = `${BASE_URL}/cliniciancategory/update`;
    const reqBody = {
      ID: id,
      Category: Category,
      Description: description,
    };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(url, reqBody);
  }
  //===Remove cliniciancategory Data==========
  remove_ClinicianCategory(id: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'x-api-key': Token,
    // });
    return this.http.post(`${BASE_URL}cliniciancategory/delete/${id}`, {});
  }
}
