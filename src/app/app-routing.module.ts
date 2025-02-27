import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {
  LoginFormComponent,
  ResetPasswordFormComponent,
  CreateAccountFormComponent,
  ChangePasswordFormComponent,
} from './components';
import { AuthGuardService } from './services';
import {
  SideNavOuterToolbarComponent,
  UnauthenticatedContentComponent,
} from './layouts';
import { DenialListComponent } from './pages/MASTER PAGES/denial/denial-list.component';
import { AnalyticsDashboardComponent } from './pages/HOME/analytics-dashboard/analytics-dashboard.component';
import { AppSignInComponent } from './pages/sign-in-form/sign-in-form.component';
import { AppSignUpComponent } from './pages/sign-up-form/sign-up-form.component';
import { AppResetPasswordComponent } from './pages/reset-password-form/reset-password-form.component';
import { FacilityListComponent } from './pages/MASTER PAGES/facility/facility-list.component';
import { FacilityGroupListComponent } from './pages/MASTER PAGES/facility-group/facility-group-list.component';
import { CPTMasterComponent } from './pages/MASTER PAGES/cpt-master/cpt-master.component';
import { SpecialityComponent } from './pages/MASTER PAGES/speciality/speciality.component';
import { CPTTypeComponent } from './pages/MASTER PAGES/cpt-type/cpt-type.component';
import { DenialCategoryComponent } from './pages/MASTER PAGES/denial-category/denial-category.component';
import { DenialTypeComponent } from './pages/MASTER PAGES/denial-type/denial-type.component';
import { FacilityTypeComponent } from './pages/MASTER PAGES/facility-type/facility-type.component';
import { ClinicianComponent } from './pages/MASTER PAGES/clinician/clinician.component';
import { InsuranceComponent } from './pages/MASTER PAGES/insurance/insurance.component';
import { PostOfficeCredentialsComponent } from './pages/SYSTEM PAGES/post-office-credentials/post-office-credentials.component';
import { InsuranceClassificationComponent } from './pages/MASTER PAGES/insurance-classification/insurance-classification.component';
import { ClinicianMajorComponent } from './pages/MASTER PAGES/clinician-major/clinician-major.component';
import { ClinicianProfessionComponent } from './pages/MASTER PAGES/clinician-profession/clinician-profession.component';
import { ClinicianCategoryComponent } from './pages/MASTER PAGES/clinician-category/clinician-category.component';
import { SecurityPolicyComponent } from './pages/SYSTEM PAGES/security-policy/security-policy.component';
import { UserLevelMasterComponent } from './pages/MASTER PAGES/user-role-master/user-role-master.component';
import { UserComponent } from './pages/MASTER PAGES/user/user.component';
import { ChangePasswordComponent } from './pages/PROFILE PAGES/change-password/change-password.component';
import { LicenseInfoComponent } from './pages/SYSTEM PAGES/license-info/license-info.component';
import { FacilityRegionComponent } from './pages/MASTER PAGES/facility-region/facility-region.component';
import { NotificationSettingsComponent } from './pages/SYSTEM PAGES/notificarion-settings/notificarion-settings.component';
import { ClaimDetailsActivityComponent } from './pages/REPORT PAGES/claim-details-activity/claim-details-activity.component';
import { ImportMasterDataComponent } from './pages/MASTER PAGES/import-master-data/import-master-data.component';
import { ClaimDetailsComponent } from './pages/REPORT PAGES/claim-details/claim-details.component';
import { ClaimSummaryMonthWiseComponent } from './pages/REPORT PAGES/claim-summary-month-wise/claim-summary-month-wise.component';
import { SynchronizeDataComponent } from './pages/ACTIVITY/synchronize-data/synchronize-data.component';
import { AutoDownloadSettingsComponent } from './pages/ACTIVITY/download-settings/auto-download-settings.component';
import { DownloadLogViewComponent } from './pages/LOGS/download-log-view/download-log-view.component';
import { ResubmissionSummaryComponent } from './pages/REPORT PAGES/resubmission-summary/resubmission-summary.component';
import { EmailLogDataComponent } from './pages/LOGS/Report-Email-Schedule/email-log-data.component';
import { SingleCliamDetailsComponent } from './pages/REPORT PAGES/single-cliam-details/single-cliam-details.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: UnauthenticatedContentComponent,
    children: [
      {
        path: 'login',
        component: LoginFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'reset-password',
        component: ResetPasswordFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'create-account',
        component: CreateAccountFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'change-password/:recoveryCode',
        component: ChangePasswordFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: SideNavOuterToolbarComponent,
    children: [
      {
        path: 'post-office-credentials',
        component: PostOfficeCredentialsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'security-policy',
        component: SecurityPolicyComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'notification-settings-page',
        component: NotificationSettingsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'insurance-page',
        component: InsuranceComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'insurance-classification',
        component: InsuranceClassificationComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'clinician-major',
        component: ClinicianMajorComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'clinician-profession',
        component: ClinicianProfessionComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'clinician-category',
        component: ClinicianCategoryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'clinicians',
        component: ClinicianComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'user-levels-Master',
        component: UserLevelMasterComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'ctp-master-page',
        component: CPTMasterComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'cpt-type',
        component: CPTTypeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'speciality',
        component: SpecialityComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'denials',
        component: DenialListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'denial-type',
        component: DenialTypeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'denial-category',
        component: DenialCategoryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'facility-page',
        component: FacilityListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'facility-group-page',
        component: FacilityGroupListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'facility-type',
        component: FacilityTypeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'facility-region-page',
        component: FacilityRegionComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'analytics-dashboard',
        component: AnalyticsDashboardComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'sign-in-form',
        component: AppSignInComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'sign-up-form',
        component: AppSignUpComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'reset-password-form',
        component: AppResetPasswordComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'import-master-data',
        component: ImportMasterDataComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'claim-detail-report',
        component: ClaimDetailsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'Single-Claim-Details',
        component: SingleCliamDetailsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'claim-detail-activity',
        component: ClaimDetailsActivityComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'Claim-Summary-Month-Wise',
        component: ClaimSummaryMonthWiseComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'license-info-page',
        component: LicenseInfoComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'Synchronize-Data-Pages',
        component: SynchronizeDataComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'Auto-Download-Settings-Page',
        component: AutoDownloadSettingsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'download-log-view-page',
        component: DownloadLogViewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'Resubmission-Summary-Page',
        component: ResubmissionSummaryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'Email-Log-Scheduling',
        component: EmailLogDataComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: '**',
        redirectTo: 'analytics-dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), BrowserModule],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
