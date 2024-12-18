import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import {
  DxLoadPanelModule,
  DxToolbarModule,
  DxValidatorComponent,
  DxValidatorModule,
} from 'devextreme-angular';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxDateBoxModule } from 'devextreme-angular';
import { DxNumberBoxModule } from 'devextreme-angular';
import { DxButtonModule } from 'devextreme-angular';
import { DxProgressBarModule } from 'devextreme-angular';
import { DataService } from 'src/app/services';
import notify from 'devextreme/ui/notify';
import { MasterReportService } from '../../MASTER PAGES/master-report.service';

@Component({
  selector: 'app-synchronize-data',
  templateUrl: './synchronize-data.component.html',
  styleUrls: ['./synchronize-data.component.scss'],
})
export class SynchronizeDataComponent implements OnInit {
  @ViewChild('facilityValidator', { static: false })
  facilityValidator!: DxValidatorComponent;

  toolbarItems = [
    {
      text: 'Synchronize Claim & Remittance Data',
      location: 'before',
    },
  ];

  FacilitydropdownItems: any;
  FacilityValue: any;
  isfacilityEmpty: boolean = false;

  facilityDownloadedCount: number = 0o0;
  RemittanceDownloadedCount: number = 0o0;

  startDate: any = new Date();
  endDate: any = new Date();
  countValue: any;
  minDate: Date;
  maxDate: Date;

  isLoading: boolean = false;
  showProgressBar: boolean = false;
  maxValue: any; // Set the maximum value for progress
  seconds: any; // The current value for progress (e.g., time elapsed)

  remittanceButtonVisibility: boolean = true;
  facilityButtonVisibility: boolean = true;
  processReportButtonVisibility: boolean = true;

  constructor(
    private dataService: DataService,
    private masterservice: MasterReportService
  ) {
    this.get_Facility_List_Data();
  }

  ngOnInit() {
    this.minDate = new Date(2000, 1, 1);
    this.maxDate = new Date();
  }

  format(ratio) {
    return `Downloading: ${ratio * 100}%`;
  }

  //=========================Fetch facility list======================
  get_Facility_List_Data() {
    this.masterservice.Get_Facility_List_Data().subscribe((response: any) => {
      if (response) {
        this.FacilitydropdownItems = response.data;
      }
    });
  }
  //====================Click event of Claim Sync====================
  // handleFacilityButtonClick() {
  //   this.facilityButtonVisibility = false;
  //   let facilityID = this.FacilityValue;
  //   let fromDate = this.convertDateToYYYYMMDD(this.startDate);
  //   let endDate = this.convertDateToYYYYMMDD(this.endDate);
  //   this.dataService
  //     .get_Claim_SyncData_Details(facilityID, fromDate, endDate)
  //     .subscribe((response: any) => {
  //       if (response.flag === 1) {
  //         console.log('Claim Sync data response =>', response);
  //       }
  //     });
  // }

  //====================Click event of Remittance Sync====================
  handleFacilityButtonClick() {
    const validationResult = this.facilityValidator.instance.validate();
    if (validationResult.isValid) {
      this.facilityButtonVisibility = false;
      this.facilityDownloadedCount = 0;
      let facilityID = this.FacilityValue;
      let fromDate = new Date(this.startDate);
      let endDate = new Date(this.endDate);
      // Calculate the total number of days between fromDate and endDate
      const totalDays =
        Math.floor(
          (endDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      this.maxValue = totalDays;
      this.seconds = 0;
      this.showProgressBar = true;

      const callApiForDate = (currentDate: any) => {
        const formattedDate = this.convertDateToYYYYMMDD(currentDate);
        this.dataService
          .get_Claim_SyncData_Details(facilityID, formattedDate, formattedDate)
          .subscribe(
            (response: any) => {
              if (response.flag === 1) {
                this.facilityDownloadedCount =
                  this.facilityDownloadedCount + response.count;
                this.seconds++;
                if (this.seconds >= totalDays) {
                  this.showProgressBar = false;
                  notify(
                    {
                      message: `Claim Sync completed!`,
                      position: { at: 'top right', my: 'top right' },
                    },
                    'success'
                  );
                } else {
                  const nextDate = new Date(currentDate);
                  nextDate.setDate(currentDate.getDate() + 1);
                  callApiForDate(nextDate);
                }
              } else {
                console.error(`Error syncing data for ${formattedDate}`);
              }
            },
            (error) => {
              console.error(`Error on ${formattedDate}:`, error);
            }
          );
      };
      callApiForDate(fromDate);
      this.facilityButtonVisibility = true;
    } else {
      notify(
        {
          message: `Select a facility value and try again..`,
          position: { at: 'top right', my: 'top right' },
        },
        'error'
      );
    }
  }

  handleRemittanceButtonClick() {
    const validationResult = this.facilityValidator.instance.validate();
    if (validationResult.isValid) {
      this.remittanceButtonVisibility = false;
      this.RemittanceDownloadedCount = 0;
      let facilityID = this.FacilityValue;
      let fromDate = new Date(this.startDate);
      let endDate = new Date(this.endDate);
      // Calculate the total number of days between fromDate and endDate
      const totalDays =
        Math.floor(
          (endDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      this.maxValue = totalDays;
      this.seconds = 0;
      this.showProgressBar = true;
      const callApiForDate = (currentDate: any) => {
        const formattedDate = this.convertDateToYYYYMMDD(currentDate);
        this.dataService
          .get_Remittance_SyncData_Details(
            facilityID,
            formattedDate,
            formattedDate
          )
          .subscribe(
            (response: any) => {
              if (response.flag === 1) {
                this.RemittanceDownloadedCount =
                  this.RemittanceDownloadedCount + response.count;
                this.seconds++;
                if (this.seconds >= totalDays) {
                  this.showProgressBar = false;
                  notify(
                    {
                      message: `Remittance Sync completed!`,
                      position: { at: 'top right', my: 'top right' },
                    },
                    'success'
                  );
                } else {
                  const nextDate = new Date(currentDate);
                  nextDate.setDate(currentDate.getDate() + 1);
                  callApiForDate(nextDate);
                }
              } else {
                console.error(`Error syncing data for ${formattedDate}`);
              }
            },
            (error) => {
              console.error(`Error on ${formattedDate}:`, error);
            }
          );
      };
      callApiForDate(fromDate);
      this.remittanceButtonVisibility = true;
    } else {
      notify(
        {
          message: `Select a facility value and try again..`,
          position: { at: 'top right', my: 'top right' },
        },
        'error'
      );
    }
  }

  //====================Click event of Process Report====================
  ProcessReportButtonClick() {
    const validationResult = this.facilityValidator.instance.validate();
    if (validationResult.isValid) {
      console.log('function started');
      this.isLoading = true;
      this.processReportButtonVisibility = false;
      let facilityID = this.FacilityValue;
      this.dataService
        .get_Process_ReportData_Details(facilityID)
        .subscribe((response: any) => {
          if (response.flag === 1) {
            this.isLoading = false;
            notify(
              {
                message: `Data Sync Successfully Completed`,
                position: { at: 'top right', my: 'top right' },
              },
              'success'
            );
          }
        });
    } else {
      notify(
        {
          message: `Select a facility value and try again..`,
          position: { at: 'top right', my: 'top right' },
        },
        'error'
      );
    }
  }

  onStartDateChange(event: any) {
    const selectedStartDate = event.value;
    if (this.endDate && selectedStartDate > this.endDate) {
      this.endDate = selectedStartDate;
    }
  }

  // Event handler for changes in End Date
  onEndDateChange(event: any) {
    const selectedEndDate = event.value;
    if (this.startDate && selectedEndDate < this.startDate) {
      this.startDate = selectedEndDate;
    }
  }
  //=================Convert the date format==================
  convertDateToYYYYMMDD(inputDate: string): string {
    const date = new Date(inputDate);
    // Get year, month, and date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxToolbarModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxNumberBoxModule,
    DxButtonModule,
    DxProgressBarModule,
    DxLoadPanelModule,
    DxValidatorModule,
  ],
  providers: [],
  exports: [],
  declarations: [SynchronizeDataComponent],
})
export class SynchronizeDataModule {}
