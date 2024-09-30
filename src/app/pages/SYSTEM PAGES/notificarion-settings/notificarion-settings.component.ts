import { Message } from 'src/app/types/messages';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { DxTabsModule } from 'devextreme-angular/ui/tabs';
import {
  DxFormModule,
  DxTextBoxModule,
  DxTextAreaModule,
  DxButtonModule,
  DxFormComponent,
  DxCheckBoxModule,
  DxValidatorModule,
  DxValidatorComponent,
  DxPopupModule,
  DxDataGridModule,
  DxDataGridComponent,
} from 'devextreme-angular';
import {
  DxHtmlEditorModule,
  DxHtmlEditorTypes,
} from 'devextreme-angular/ui/html-editor';
import { DxTabPanelModule } from 'devextreme-angular';
import { SystemServicesService } from '../system-services.service';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
import notify from 'devextreme/ui/notify';

type EditorOptions = DxTextBoxTypes.Properties;
@Component({
  selector: 'app-notificarion-settings',
  templateUrl: './notificarion-settings.component.html',
  styleUrls: ['./notificarion-settings.component.scss'],
})
export class NotificationSettingsComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;

  @ViewChild(DxValidatorComponent, { static: false })
  validator: DxValidatorComponent;

  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  tabsWithIconAndText: any = [
    {
      id: 0,
      text: 'E-mail',
      icon: 'bi bi-envelope',
    },
    {
      id: 1,
      text: 'SMS',
      icon: 'bi bi-chat-square-text-fill',
    },
    {
      id: 2,
      text: 'WhatsApp',
      icon: 'bi bi-whatsapp',
    },
  ];

  HtmleditorOptions: any = {
    height: 200,
    toolbar: {
      items: [
        'undo',
        'redo',
        'separator',
        'bold',
        'italic',
        'underline',
        'separator',
        'color',
        'background',
        'separator',
        'clear',
        'separator',
        'insertLink',
        'insertImage',
      ],
    },
  };

  formData = {
    EmailSenderID: '',
    EmailSenderName: '',
    EmailSenderPassword: '',
    EmailSMTPHost: '',
    EmailSMTPPort: '',
    EmailEnableSSL: false,
    SMSProviderURL: '',
    SMSUserID: '',
    SMSPassword: '',
    SMSMobileNo: '',
    WhatsappSource: '',
    WhatsappNumber: '',
  };

  defaultRowData: any = {
    NotificationType: '',
    SendEmail: false,
    EmailSubject: '',
    EmailMessage: '',
    SendSMS: false,
    SMSTemplate: '',
    SendWhatsapp: false,
    WhatsappTemplate: '',
    Notification: '',
  };
  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  dataSource: any;

  valueContent: string;

  editorValueType: DxHtmlEditorTypes.MarkupType = 'html';

  clickedTabName: string = 'E-mail'; // Set your initial tab

  showTabNavButtons = false;
  scrollByContent = false;
  rtlEnabled = false;
  orientation: any = 'horizontal';
  stylingMode: any = 'secondary';
  iconPosition: any = 'start';
  width = 'auto';
  animationEnabled: any = true;
  emailFormData: any;
  smsFormData: any;
  whatsappFormData: any;

  isPasswordVisible: boolean = false;
  isEmailVisible: boolean;
  isSMSVisible: boolean;
  iswhatsAppVisible: boolean;

  testMailpopupVisible: boolean = false;
  TestMailReceiverID: any = '';
  TestMailSubject: any = '';
  TestMailMessageBody: any = '';

  clickedEditRowData: any;
  isRowDataEditing: boolean = false;
  editpopupHeading: any;

  constructor(private service: SystemServicesService) {}

  ngOnInit() {
    this.getNotificationSettingsData();
    this.getNotificationSettingsTemplateList();
    this.updateVisibility(); // Set visibility when component is loaded
  }

  //=================Notification Settings Data===============
  getNotificationSettingsData() {
    this.service.getSecurityNotificationData().subscribe((response: any) => {
      this.formData = response.data[0];
    });
  }
  //=========Notification Settings Template Data======
  getNotificationSettingsTemplateList() {
    this.service.getNotificationTemplateList().subscribe((response: any) => {
      response.data.forEach((item: any, index: number) => {
        item.serialNumber = index + 1;
      });
      this.dataSource = response.data;
    });
  }
  //================Tab Click event===============
  onTabClick(e: any) {
    this.clickedTabName = e.itemData.text;
    this.updateVisibility();
  }
  updateVisibility() {
    this.isEmailVisible = this.clickedTabName === 'E-mail';
    this.isSMSVisible = this.clickedTabName === 'SMS';
    this.iswhatsAppVisible = this.clickedTabName === 'WhatsApp';
  }

  //===========================================Test mail starting===============================
  //===============Test Mail Button Click==========
  onClickTestMail() {
    this.testMailpopupVisible = true;
  }
  //==============test mail sending===============
  onTestMailSending() {
    const userID: any = JSON.parse(localStorage.getItem('logData')).UserID;
    const receiverid = this.TestMailReceiverID;
    const subject = this.TestMailSubject;
    const Message = this.TestMailMessageBody;
    this.service
      .sendTestMail(userID, receiverid, subject, Message)
      .subscribe((response: any) => {
        if (response.message) {
          notify(
            {
              message: `The test e-mail has been send Successfully`,
              position: { at: 'top right', my: 'top right' },
            },
            'success'
          );
          this.testMailpopupVisible = false;
        }
      });
  }
  //===========Clear data on popup close===========
  cleardata() {
    this.TestMailReceiverID = '';
    this.TestMailSubject = '';
    this.TestMailMessageBody = '';
  }

  //===========================================Test mail ending===============================

  //==============================================================================
  //=============onClick notification editing==========
  onEditingStart(event: any) {
    this.clickedEditRowData = { ...this.defaultRowData };
    this.clickedEditRowData = event.data;
    this.editpopupHeading = `${this.clickedEditRowData.Notification} event`;
    event.cancel = true;
    this.isRowDataEditing = true;
  }

  //============update Notification template ============
  onClickSaveNotificationTemplate() {
    this.service
      .updateNotificationSettingTemplate(this.clickedEditRowData)
      .subscribe((response: any) => {
        if (response.flag == 1) {
          this.isRowDataEditing = false;
          notify(
            {
              message: `Your notification template updated successfully`,
              position: { at: 'top right', my: 'top right' },
            },
            'success'
          );
          this.getNotificationSettingsTemplateList();
        } else {
          this.isRowDataEditing = false;
          notify(
            {
              message: `Sorry..! Your notification template update failed`,
              position: { at: 'top right', my: 'top right' },
            },
            'error'
          );
        }
      });
  }

  clearFormData() {
    this.clickedEditRowData = { ...this.defaultRowData };
    this.isRowDataEditing = false;
    // this.clickedEditRowData.EmailMessage = '';
    // this.clickedEditRowData.SendEmail = false;
    // this.clickedEditRowData.EmailSubject = '';
    // this.clickedEditRowData.SendSMS = false;
    // this.clickedEditRowData.SMSTemplate = '';
    // this.clickedEditRowData.SendWhatsapp = false;
    // this.clickedEditRowData.WhatsappTemplate = '';
  }

  onRowUpdating(event: any) {}
  //================On Click Save Notification Settings============
  onClickSave() {
    const validationResult = this.validator.instance.validate();
    if (validationResult.isValid) {
      console.log('Form Data:', this.formData);
      this.service
        .saveNotificationSettings(this.formData)
        .subscribe((response: any) => {
          if (response) {
            notify(
              {
                message: `Your notification settings updated successfully`,
                position: { at: 'top right', my: 'top right' },
              },
              'success'
            );
          }
        });
    } else {
      console.log('Form is invalid');
    }
  }

  //============== Page refreshing==================
  refresh = () => {
    this.dataGrid.instance.refresh();
  };
}
@NgModule({
  imports: [
    CommonModule,
    DxTabsModule,
    DxTabPanelModule,
    DxFormModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxPopupModule,
    DxValidatorModule,
    DxHtmlEditorModule,
    DxDataGridModule,
  ],
  providers: [],
  exports: [],
  declarations: [NotificationSettingsComponent],
})
export class NotificationSettingsModule {}
