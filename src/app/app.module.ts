import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SafePipe } from './Officer/Relation/safe.pipe';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//Student
import { HomeStudentComponent } from './Student/home-student/home-student.component';
import { LoginStudentComponent } from './Student/login-student/login-student.component';
import { AboutUsComponent } from './Student/about-us/about-us.component';
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
//Service
import { CompanyStudentService } from './Student/General/search-company-student/company-student/company-student.service';

//Officer
import { LoginOfficerComponent } from './Officer/login-officer/login-officer.component';
import { HomeOfficerComponent } from './Officer/home-officer/home-officer.component';
import { AboutUsOfComponent } from './Officer/about-us-of/about-us-of.component';
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
//Service
import { DataStorageService } from './Officer/General/search-company-officer/company-information/data-storage.service';

@NgModule({
  declarations: [
    //Student
    HomeStudentComponent,
    LoginStudentComponent,
    AboutUsComponent,
    //Calendar
    SearchCalendarStudentComponent,
    CalendarStudentComponent,
    //Status
    CancelStatusComponent,
    ConfirmStatusComponent,
    WaitStatusComponent,
    ConfirmAssessmentStatusComponent,
    WaitAssessmentStatusComponent,
    //Company-student
    SearchCompanyStudentComponent,
    CompanyStudentComponent,
    SelectCompanyComponent,
    CompanyStudentPopupComponent,
    //Profile
    ProfileStudentComponent,
    EditProfileComponent,
    EditProfilePopupComponent,
    //Company-form
    CompanyFormStudentComponent,
    CompanyFormStudentPopupComponent,
    AppComponent,

    //Officer
    LoginOfficerComponent,
    HomeOfficerComponent,
    AboutUsOfComponent,
    //Student-officer
    SearchStudentOfficerComponent,
    StudentInformationComponent,
    StudentDetailComponent,
    //Company-officer
    SearchCompanyOfficerComponent,
    CompanyInformationComponent,
    AddCompanyComponent,
    AddInternalCompanyComponent,
    EditCompanyComponent,
    EditCompanyPopupComponent,
    DialogComponent,

    //Status
    StatusOfficerComponent,
    StatusInformationComponent,
    StatusInformationPopupComponent,
    //Form
    SearchReportFormOfficerComponent,
    ReportFormComponent,
    SearchEvaluationFormOfficerComponent,
    EvaluationFormComponent,
    SearchNotifyingFormOfficerComponent,
    NotifyingFormComponent,
    SearchPermissionFormOfficerComponent,
    PermissionFormComponent,
    SearchSendFormOfficerComponent,
    SendFormComponent,
    SearchThanksFormOfficerComponent,
    ThanksFormComponent,
    //Relations
    RelationOfficerComponent,
    AddRelationComponent,
    EditRelationComponent,
    AddRelationPopupComponent,
    EditRelationPopupComponent,
    DeleteRelationPopupComponent,
    AllRelationComponent,

    SafePipe,
  ],

  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    NgxExtendedPdfViewerModule,
  ],

  providers: [
    MatDialog,
    DataStorageService,
    CompanyStudentService,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },
  ],

  bootstrap: [AppComponent]
})
export class AppModule { constructor() {
  registerLocaleData(localeTh, 'th');
}
}
