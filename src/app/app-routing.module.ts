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
import { AnalyticsDashboardComponent } from './pages/analytics-dashboard/analytics-dashboard.component';
import { AppSignInComponent } from './pages/sign-in-form/sign-in-form.component';
import { AppSignUpComponent } from './pages/sign-up-form/sign-up-form.component';
import { AppResetPasswordComponent } from './pages/reset-password-form/reset-password-form.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ClaimSummaryComponent } from './pages/REPORT PAGES/claim-summary/claim-summary.component';
import { ClaimSummaryMonthWiseComponent } from './pages/REPORT PAGES/claim-summary-month-wise/claim-summary-month-wise.component';
import { ResubmissionSummaryComponent } from './pages/REPORT PAGES/resubmission-summary/resubmission-summary.component';
import { BalanceAmountToBeReceivedComponent } from './pages/REPORT PAGES/balance-amount-to-be-received/balance-amount-to-be-received.component';
import { RejectedClaimsComponent } from './pages/REPORT PAGES/rejected-claims/rejected-claims.component';
import { DoctorWithHighDenialsComponent } from './pages/REPORT PAGES/doctor-with-high-denials/doctor-with-high-denials.component';
import { DoctorWithHighIncomeComponent } from './pages/REPORT PAGES/doctor-with-high-income/doctor-with-high-income.component';
import { ClaimSummaryPayerWiseComponent } from './pages/REPORT PAGES/claim-summary-payer-wise/claim-summary-payer-wise.component';
import { FacilityListComponent } from './pages/MASTER PAGES/facility/facility-list.component';
import { FacilityGroupListComponent } from './pages/MASTER PAGES/facility-group/facility-group-list.component';
import { CPTMasterComponent } from './pages/MASTER PAGES/cpt-master/cpt-master.component';
import { SpecialityComponent } from './pages/MASTER PAGES/speciality/speciality.component';
import { CPTTypeComponent } from './pages/MASTER PAGES/cpt-type/cpt-type.component';
import { DenialCategoryComponent } from './pages/MASTER PAGES/denial-category/denial-category.component';
import { DenialTypeComponent } from './pages/MASTER PAGES/denial-type/denial-type.component';
import { FacilityTypeComponent } from './pages/MASTER PAGES/facility-type/facility-type.component';
import { ClinicianComponent } from './pages/MASTER PAGES/clinician/clinician.component';
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
        path: 'clinicial-page',
        component: ClinicianComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'ctp-master-page',
        component: CPTMasterComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'ctp-type-page',
        component: CPTTypeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'speciality-master',
        component: SpecialityComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'denial-list-page',
        component: DenialListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'denial-type-page',
        component: DenialTypeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'denial-category-page',
        component: DenialCategoryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'facilities-page',
        component: FacilityListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'facility-group-page',
        component: FacilityGroupListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'facility-type-page',
        component: FacilityTypeComponent,
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
        path: 'user-profile',
        component: UserProfileComponent,
      },
      {
        path: 'claim-summary-date-page',
        component: ClaimSummaryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'claim-summary-month-page',
        component: ClaimSummaryMonthWiseComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'claim-summary-payer-page',
        component: ClaimSummaryPayerWiseComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'doctor-high-income-page',
        component: DoctorWithHighIncomeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'doctor-high-denials-page',
        component: DoctorWithHighDenialsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'rejected-claims-page',
        component: RejectedClaimsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'balance-amount-page',
        component: BalanceAmountToBeReceivedComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'resubmission-summary-page',
        component: ResubmissionSummaryComponent,
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
