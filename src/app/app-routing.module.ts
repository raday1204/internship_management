import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

//Student
import { HomeStudentComponent } from './Student/home-student/home-student.component';
import { LoginStudentComponent } from './Student/login-student/login-student.component';
//calendar
import { SearchCalendarStudentComponent } from './Student/General/search-calendar-student/search-calendar-student.component';
import { CalendarStudentComponent } from './Student/General/search-calendar-student/calendar-student/calendar-student.component';
//Status
import { CancelStatusComponent } from './Student/General/status-student/cancel-status/cancel-status.component';
import { ConfirmStatusComponent } from './Student/General/status-student/confirm-status/confirm-status.component';
import { WaitStatusComponent } from './Student/General/status-student/wait-status/wait-status.component';
import { ConfirmAssessmentStatusComponent } from './Student/General/assessment-status/confirm-assessment-status/confirm-assessment-status.component';
import { WaitAssessmentStatusComponent } from './Student/General/assessment-status/wait-assessment-status/wait-assessment-status.component';
//Company-student
import { SearchCompanyStudentComponent } from './Student/General/search-company-student/search-company-student.component';
import { CompanyStudentComponent } from './Student/General/search-company-student/company-student/company-student.component';
import { SelectCompanyComponent } from './Student/General/search-company-student/company-student/select-company/select-company.component';
import { CompanyStudentPopupComponent } from './Student/General/search-company-student/company-student/company-student-popup/company-student-popup.component';
//Profile
import { ProfileStudentComponent } from './Student/General/profile-student/profile-student.component';
import { EditProfileComponent } from './Student/General/profile-student/edit-profile/edit-profile.component';
import { EditProfilePopupComponent } from './Student/General/profile-student/edit-profile/edit-profile-popup/edit-profile-popup.component';
//01Company-form
import { CompanyFormStudentComponent } from './Student/Form/company-form-student/company-form-student.component';
import { CompanyFormStudentPopupComponent } from './Student/Form/company-form-student/company-form-student-popup/company-form-student-popup.component';

//Officer
import { LoginOfficerComponent } from './Officer/login-officer/login-officer.component';
import { HomeOfficerComponent } from './Officer/home-officer/home-officer.component';
//Student-officer
import { SearchStudentOfficerComponent } from './Officer/General/search-student-officer/search-student-officer.component';
import { StudentInformationComponent } from './Officer/General/search-student-officer/student-information/student-information.component';
import { StudentDetailComponent } from './Officer/General/search-student-officer/student-information/student-detail/student-detail.component';
//Company-officer
import { SearchCompanyOfficerComponent } from './Officer/General/search-company-officer/search-company-officer.component';
import { CompanyInformationComponent } from './Officer/General/search-company-officer/company-information/company-information.component';
import { EditCompanyComponent } from './Officer/General/search-company-officer/company-information/edit-company/edit-company.component';
import { AddInternalCompanyComponent } from './Officer/General/search-company-officer/company-information/add-company/add-internal-company/add-internal-company.component';
import { EditCompanyPopupComponent } from './Officer/General/search-company-officer/company-information/edit-company/edit-company-popup/edit-company-popup.component';
import { DialogComponent } from './Officer/General/search-company-officer/company-information/add-company/add-internal-company/dialog/dialog.component';
//Status
import { StatusOfficerComponent } from './Officer/General/status-officer/status-officer.component';
import { StatusInformationComponent } from './Officer/General/status-officer/status-information/status-information.component';
import { StatusInformationPopupComponent } from './Officer/General/status-officer/status-information/status-information-popup/status-information-popup.component';
//Form
import { SearchReportFormOfficerComponent } from './Officer/Form/search-report-form-officer/search-report-form-officer.component';
import { ReportFormComponent } from './Officer/Form/search-report-form-officer/report-form/report-form.component';
import { SearchEvaluationFormOfficerComponent } from './Officer/Form/search-evaluation-form-officer/search-evaluation-form-officer.component';
import { EvaluationFormComponent } from './Officer/Form/search-evaluation-form-officer/evaluation-form/evaluation-form.component';
import { SearchNotifyingFormOfficerComponent } from './Officer/Form/search-notifying-form-officer/search-notifying-form-officer.component';
import { NotifyingFormComponent } from './Officer/Form/search-notifying-form-officer/notifying-form/notifying-form.component';
import { SearchPermissionFormOfficerComponent } from './Officer/Form/search-permission-form-officer/search-permission-form-officer.component';
import { PermissionFormComponent } from './Officer/Form/search-permission-form-officer/permission-form/permission-form.component';
import { SearchSendFormOfficerComponent } from './Officer/Form/search-send-form-officer/search-send-form-officer.component';
import { SendFormComponent } from './Officer/Form/search-send-form-officer/send-form/send-form.component';
import { SearchThanksFormOfficerComponent } from './Officer/Form/search-thanks-form-officer/search-thanks-form-officer.component';
import { ThanksFormComponent } from './Officer/Form/search-thanks-form-officer/thanks-form/thanks-form.component';
import { AddRelationComponent } from './Officer/Relation/add-relation/add-relation.component';
//Relations
import { AllRelationComponent } from './Student/all-relation/all-relation.component';
import { EditRelationComponent } from './Officer/Relation/edit-relation/edit-relation.component';
import { RelationOfficerComponent } from './Officer/Relation/relation-officer/relation-officer.component';
import { AddCompanyComponent } from './Officer/General/search-company-officer/company-information/add-company/add-company.component';
import { AddRelationPopupComponent } from './Officer/Relation/add-relation/add-relation-popup/add-relation-popup.component';
import { EditRelationPopupComponent } from './Officer/Relation/edit-relation/edit-relation-popup/edit-relation-popup.component';
import { DeleteRelationPopupComponent } from './Officer/Relation/relation-officer/delete-relation-popup/delete-relation-popup.component';


const routes: Routes = [
  { path: 'app', component: AppComponent },
  //Student
  { path: '', redirectTo: '/login-student', pathMatch: 'full' },
  { path: 'home-student', component: HomeStudentComponent },
  { path: 'login-student', component: LoginStudentComponent },
  //Calendar
  { path: 'search-calendar-student', component: SearchCalendarStudentComponent },
  { path: 'calendar-student', component: CalendarStudentComponent },
  //Status
  { path: 'cancel-status', component: CancelStatusComponent },
  { path: 'confirm-status', component: ConfirmStatusComponent },
  { path: 'wait-status', component: WaitStatusComponent },
  { path: 'wait-assessment-status', component: WaitAssessmentStatusComponent },
  { path: 'confirm-assessment-status', component: ConfirmAssessmentStatusComponent },
  //Company-student
  { path: 'search-company-student', component: SearchCompanyStudentComponent },
  { path: 'company-student', component: CompanyStudentComponent },
  { path: 'select-company', component: SelectCompanyComponent },
  { path: 'company-student-popup', component: CompanyStudentPopupComponent },
  //Profile
  { path: 'profile-student', component: ProfileStudentComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'edit-profile-popup', component: EditProfilePopupComponent },
  //Company-form
  { path: 'company-form-student', component: CompanyFormStudentComponent },
  { path: 'company-form-student-popup', component: CompanyFormStudentPopupComponent },

  //Officer
  { path: 'login-officer', component: LoginOfficerComponent },
  { path: 'home-officer', component: HomeOfficerComponent },
  //Student-officer
  { path: 'search-student-officer', component: SearchStudentOfficerComponent },
  { path: 'student-information', component: StudentInformationComponent },
  { path: 'student-detail', component: StudentDetailComponent },
  //Company-officer  
  { path: 'add-company', component: AddCompanyComponent },
  { path: 'edit-company/:company_id', component: EditCompanyComponent },
  { path: 'edit-company-popup', component: EditCompanyPopupComponent },
  { path: 'add-internal-company/:company_id', component: AddInternalCompanyComponent },
  { path: 'dialog', component: DialogComponent },
  { path: 'search-company-officer', component: SearchCompanyOfficerComponent },
  { path: 'company-information', component: CompanyInformationComponent },
  //Status
  { path: 'status-information', component: StatusInformationComponent },
  { path: 'status-information-popup', component: StatusInformationPopupComponent },
  { path: 'status-officer', component: StatusOfficerComponent },
  //Form
  { path: 'search-report-form-officer', component: SearchReportFormOfficerComponent },
  { path: 'report-form', component: ReportFormComponent },
  { path: 'search-evaluation-form-officer', component: SearchEvaluationFormOfficerComponent },
  { path: 'evaluation-form', component: EvaluationFormComponent },
  { path: 'search-notifying-form-officer', component: SearchNotifyingFormOfficerComponent },
  { path: 'notifying-form', component: NotifyingFormComponent },
  { path: 'search-permission-form-officer', component: SearchPermissionFormOfficerComponent },
  { path: 'permission-form', component: PermissionFormComponent },
  { path: 'search-send-form-officer', component: SearchSendFormOfficerComponent },
  { path: 'send-form', component: SendFormComponent },
  { path: 'search-thanks-form-officer', component: SearchThanksFormOfficerComponent },
  { path: 'thanks-form', component: ThanksFormComponent },
  //Relations  
  { path: 'relation-officer', component: RelationOfficerComponent },
  { path: 'all-relation', component: AllRelationComponent },
  { path: 'add-relation', component: AddRelationComponent },
  { path: 'edit-relation/:id', component: EditRelationComponent },
  { path: 'add-relation-popup', component: AddRelationPopupComponent },
  { path: 'edit-relation-popup', component: EditRelationPopupComponent },
  { path: 'delete-relation-popup', component: DeleteRelationPopupComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }