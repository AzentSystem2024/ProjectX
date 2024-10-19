import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxSelectBoxModule } from 'devextreme-angular';
import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SingleCardModule } from './layouts';
import {
  AppFooterModule,
  ResetPasswordFormModule,
  CreateAccountFormModule,
  ChangePasswordFormModule,
  LoginFormModule,
} from './components';
import { HttpClientModule } from '@angular/common/http';
import { AuthService, ScreenService, AppInfoService } from './services';
import { UnauthenticatedContentModule } from './layouts/unauthenticated-content/unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { DenialListModule } from './pages/MASTER PAGES/denial/denial-list.component';
import { AnalyticsDashboardModule } from './pages/HOME/analytics-dashboard/analytics-dashboard.component';
import { ThemeService } from './services';
import { DxFormModule } from 'devextreme-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskListModule } from 'src/app/components/library/task-list-grid/task-list-grid.component';
import { ClaimSummaryModule } from './pages/REPORT PAGES/claim-summary/claim-summary.component';
import { ClaimSummaryMonthWiseComponent } from './pages/REPORT PAGES/claim-summary-month-wise/claim-summary-month-wise.component';
import { ClaimSummaryPayerWiseComponent } from './pages/REPORT PAGES/claim-summary-payer-wise/claim-summary-payer-wise.component';
import { DoctorWithHighIncomeComponent } from './pages/REPORT PAGES/doctor-with-high-income/doctor-with-high-income.component';
import { DoctorWithHighDenialsComponent } from './pages/REPORT PAGES/doctor-with-high-denials/doctor-with-high-denials.component';
import { RejectedClaimsComponent } from './pages/REPORT PAGES/rejected-claims/rejected-claims.component';
import { BalanceAmountToBeReceivedComponent } from './pages/REPORT PAGES/balance-amount-to-be-received/balance-amount-to-be-received.component';
import { ResubmissionSummaryComponent } from './pages/REPORT PAGES/resubmission-summary/resubmission-summary.component';
import { UserModule } from './pages/MASTER PAGES/user/user.component';
import { UserNewFormModule } from './pages/POP-UP_PAGES/user-new-form/user-new-form.component';
import { UserEditFormModule } from './pages/POP-UP_PAGES/user-edit-form/user-edit-form.component';
import { ResetPasswordModule } from './pages/POP-UP_PAGES/reset-password/reset-password.component';
import { ChangePasswordModule } from './pages/PROFILE PAGES/change-password/change-password.component';
import { ImportMasterDataModule } from './pages/MASTER PAGES/import-master-data/import-master-data.component';
import { ImportMasterDataFormModule } from './pages/POP-UP_PAGES/import-master-data-form/import-master-data-form.component';
import { ViewImportedMasterDataFormModule } from './pages/POP-UP_PAGES/view-imported-master-data-form/view-imported-master-data-form.component';
// import { SessionTimeoutDialogComponent } from './components/library/session-timeout-dialog/session-timeout-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    ClaimSummaryMonthWiseComponent,
    ClaimSummaryPayerWiseComponent,
    DoctorWithHighIncomeComponent,
    DoctorWithHighDenialsComponent,
    RejectedClaimsComponent,
    BalanceAmountToBeReceivedComponent,
    ResubmissionSummaryComponent,
    // SessionTimeoutDialogComponent
  ],
  imports: [
    TaskListModule,
    BrowserModule,
    SideNavOuterToolbarModule,
    SingleCardModule,
    AppFooterModule,
    ResetPasswordFormModule,
    CreateAccountFormModule,
    ChangePasswordFormModule,
    LoginFormModule,
    UnauthenticatedContentModule,
    DxSelectBoxModule,
    DenialListModule,
    ClaimSummaryModule,
    AnalyticsDashboardModule,
    DxFormModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    UserModule,
    UserNewFormModule,
    UserEditFormModule,
    ResetPasswordModule,
    ChangePasswordModule,
    ImportMasterDataModule,
    ImportMasterDataFormModule,
    ViewImportedMasterDataFormModule
  ],
  providers: [AuthService, ScreenService, AppInfoService, ThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
