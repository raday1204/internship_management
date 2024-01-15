import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { AdviceStudentComponent } from './Student/General/advice-student/advice-student.component';
import { CalendarStudentComponent } from './Student/General/calendar-student/calendar-student.component';
import { CancelStatusComponent } from './Student/General/status-studen/cancel-status/cancel-status.component';
import { ConfirmStatusComponent } from './Student/General/status-studen/confirm-status/confirm-status.component';
import { WaitStatusComponent } from './Student/General/status-studen/wait-status/wait-status.component';
import { CompanyStudentComponent } from './Student/General/search-company-student/company-student/company-student.component';
import { SelectCompanyComponent } from './Student/General/search-company-student/company-student/select-company/select-company.component';
import { CoordinatorStudentComponent } from './Student/General/coordinator-student/coordinator-student.component';
import { CourseStudentComponent } from './Student/General/course-student/course-student.component';
import { HomeStudentComponent } from './Student/home-student/home-student.component';
import { LoginStudentComponent } from './Student/login-student/login-student.component';
import { ProfileStudentComponent } from './Student/General/profile-student/profile-student.component';
import { EditProfileComponent } from './Student/General/profile-student/edit-profile/edit-profile.component';
import { AcceptanceFormStudentComponent } from './Student/Form/acceptance-form-student/acceptance-form-student.component';
import { CompanyFormStudentComponent } from './Student/Form/company-form-student/company-form-student.component';
import { DiaryFormStudentComponent } from './Student/Form/diary-form-student/diary-form-student.component';
import { EvaluationFormStudentComponent } from './Student/Form/evaluation-form-student/evaluation-form-student.component';
import { ManualFormStudentComponent } from './Student/Form/manual-form-student/manual-form-student.component';
import { SearchCompanyStudentComponent } from './Student/General/search-company-student/search-company-student.component';
import { CompanyFormStudentPrintComponent } from './Student/Form/company-form-student/company-form-student-print/company-form-student-print.component';
import { WaitAssessmentStatusComponent } from './Student/General/assessment-status/wait-assessment-status/wait-assessment-status.component';
import { ConfirmAssessmentStatusComponent } from './Student/General/assessment-status/confirm-assessment-status/confirm-assessment-status.component';
import { AllRelationComponent } from './Student/all-relation/all-relation.component';

import { SearchStudentOfficerComponent } from './Officer/General/search-student-officer/search-student-officer.component';
import { StudentInformationComponent } from './Officer/General/search-student-officer/student-information/student-information.component';
import { SearchCompanyOfficerComponent } from './Officer/General/search-company-officer/search-company-officer.component';
import { CompanyInformationComponent } from './Officer/General/search-company-officer/company-information/company-information.component';
import { StatusOfficerComponent } from './Officer/General/status-officer/status-officer.component';
import { SearchReportFormOfficerComponent } from './Officer/Form/search-report-form-officer/search-report-form-officer.component';
import { SearchConfirmFormOfficerComponent } from './Officer/Form/search-confirm-form-officer/search-confirm-form-officer.component';
import { SearchEvaluationFormOfficerComponent } from './Officer/Form/search-evaluation-form-officer/search-evaluation-form-officer.component';
import { SearchNotifyingFormOfficerComponent } from './Officer/Form/search-notifying-form-officer/search-notifying-form-officer.component';
import { SearchPermissionFormOfficerComponent } from './Officer/Form/search-permission-form-officer/search-permission-form-officer.component';
import { SearchSendFormOfficerComponent } from './Officer/Form/search-send-form-officer/search-send-form-officer.component';
import { SearchThanksFormOfficerComponent } from './Officer/Form/search-thanks-form-officer/search-thanks-form-officer.component';
import { AddRelationComponent } from './Officer/Relation/add-relation/add-relation.component';
import { EditRelationComponent } from './Officer/Relation/edit-relation/edit-relation.component';
import { LoginOfficerComponent } from './Officer/login-officer/login-officer.component';
import { HomeOfficerComponent } from './Officer/home-officer/home-officer.component';
import { RelationOfficerComponent } from './Officer/Relation/relation-officer/relation-officer.component';
import { AddCompanyComponent } from './Officer/General/search-company-officer/company-information/add-company/add-company.component';
import { EditCompanyComponent } from './Officer/General/search-company-officer/company-information/edit-company/edit-company.component';
import { AddInternalCompanyComponent } from './Officer/General/search-company-officer/company-information/add-company/add-internal-company/add-internal-company.component';
import { DialogComponent } from './Officer/General/search-company-officer/company-information/add-company/add-internal-company/dialog/dialog.component';
import { StatusInformationComponent } from './Officer/General/status-officer/status-information/status-information.component';
import { ConfirmFormComponent } from './Officer/Form/search-confirm-form-officer/confirm-form/confirm-form.component';
import { EvaluationFormComponent } from './Officer/Form/search-evaluation-form-officer/evaluation-form/evaluation-form.component';
import { NotifyingFormComponent } from './Officer/Form/search-notifying-form-officer/notifying-form/notifying-form.component';
import { PermissionFormComponent } from './Officer/Form/search-permission-form-officer/permission-form/permission-form.component';
import { SendFormComponent } from './Officer/Form/search-send-form-officer/send-form/send-form.component';
import { ThanksFormComponent } from './Officer/Form/search-thanks-form-officer/thanks-form/thanks-form.component';
import { ReportFormComponent } from './Officer/Form/search-report-form-officer/report-form/report-form.component';
import { SearchCalendarStudentComponent } from './Student/General/search-calendar-student/search-calendar-student.component';
import { StudentDetailComponent } from './Officer/General/search-student-officer/student-information/student-detail/student-detail.component';

const routes: Routes = [
  { path: 'app', component: AppComponent },
  { path: '', redirectTo: '/login-student', pathMatch: 'full' },
  { path: 'advice-student', component: AdviceStudentComponent },
  { path: 'calendar-student', component: CalendarStudentComponent },
  { path: 'cancel-status', component: CancelStatusComponent },
  { path: 'confirm-status', component: ConfirmStatusComponent },
  { path: 'wait-status', component: WaitStatusComponent },
  { path: 'company-student', component: CompanyStudentComponent },
  { path: 'select-company', component: SelectCompanyComponent },
  { path: 'coordinator-student', component: CoordinatorStudentComponent },
  { path: 'course-student', component: CourseStudentComponent },
  { path: 'home-student', component: HomeStudentComponent },
  { path: 'login-student', component: LoginStudentComponent },
  { path: 'profile-student', component: ProfileStudentComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'acceptance-form-student', component: AcceptanceFormStudentComponent },
  { path: 'company-form-student', component: CompanyFormStudentComponent },
  { path: 'diary-form-student', component: DiaryFormStudentComponent },
  { path: 'evaluation-form-student', component: EvaluationFormStudentComponent },
  { path: 'manual-form-student', component: ManualFormStudentComponent },
  { path: 'search-company-student', component: SearchCompanyStudentComponent },
  { path: 'company-form-student-print', component: CompanyFormStudentPrintComponent },
  { path: 'wait-assessment-status', component: WaitAssessmentStatusComponent },
  { path: 'confirm-assessment-status', component: ConfirmAssessmentStatusComponent },
  { path: 'all-relation', component: AllRelationComponent },
  { path: 'search-calendar-student', component: SearchCalendarStudentComponent },

  { path: 'search-student-officer', component: SearchStudentOfficerComponent },
  { path: 'student-information', component: StudentInformationComponent },
  { path: 'search-company-officer', component: SearchCompanyOfficerComponent },
  { path: 'company-information', component: CompanyInformationComponent },
  { path: 'status-officer', component: StatusOfficerComponent },
  { path: 'search-report-form-officer', component: SearchReportFormOfficerComponent },
  { path: 'search-confirm-form-officer', component: SearchConfirmFormOfficerComponent },
  { path: 'search-evaluation-form-officer', component: SearchEvaluationFormOfficerComponent },
  { path: 'search-notifying-form-officer', component: SearchNotifyingFormOfficerComponent },
  { path: 'search-permission-form-officer', component: SearchPermissionFormOfficerComponent },
  { path: 'search-send-form-officer', component: SearchSendFormOfficerComponent },
  { path: 'search-thanks-form-officer', component: SearchThanksFormOfficerComponent },
  { path: 'add-relation', component: AddRelationComponent },
  { path: 'edit-relation/:id', component: EditRelationComponent },
  { path: 'login-officer', component: LoginOfficerComponent },
  { path: 'home-officer', component: HomeOfficerComponent },
  { path: 'relation-officer', component: RelationOfficerComponent },
  { path: 'add-company', component: AddCompanyComponent },
  { path: 'edit-company/:company_id', component: EditCompanyComponent },
  { path: 'add-internal-company/:company_id', component: AddInternalCompanyComponent },
  { path: 'dialog', component: DialogComponent },
  { path: 'status-information', component: StatusInformationComponent },
  { path: 'confirm-form', component: ConfirmFormComponent },
  { path: 'evaluation-form', component: EvaluationFormComponent },
  { path: 'notifying-form', component: NotifyingFormComponent },
  { path: 'permission-form', component: PermissionFormComponent },
  { path: 'send-form', component: SendFormComponent },
  { path: 'thanks-form', component: ThanksFormComponent },
  { path: 'report-form', component: ReportFormComponent },
  { path: 'student-detail', component: StudentDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }