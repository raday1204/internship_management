import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { DataStorageService } from '../../data-storage.service';
import { CompanyStudentService } from 'src/app/Student/General/search-company-student/company-student/company-student.service';

interface CompanyData {
  company_id: string;
  company_name: string;
  send_name: string;
  send_coordinator: string;
  send_position: string;
  send_tel: string;
  send_email: string;
  send_mobile: string;
  company_building: string;
  company_job: string;
}

interface NeedStudentData {
  number_student_train: number;
  date_addtraining: string;
  date_endtraining: string;
}

interface CompanyResponse {
  success: boolean;
  data: {
    company: CompanyData;
    need_student: NeedStudentData;
  };
}

@Component({
  selector: 'app-add-internal-company',
  templateUrl: './add-internal-company.component.html',
  styleUrls: ['./add-internal-company.component.css'],
})
export class AddInternalCompanyComponent implements OnInit {
  company: any = {
    company_id: '',
    company_name: '',
    company_building: '',
    company_job: ''
  };
  need_student: any = {
    number_student_train: '',
    date_addtraining: '',
    date_endtraining: ''
  };
  CompanyInformation: any = {};
  internalCompanyForm: FormGroup;
  companyForm: FormGroup;
  selectedOption4: any;
  companyData: CompanyData = {} as CompanyData;
  username: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private companyStudentService: CompanyStudentService,
    private DataStorageService: DataStorageService
  ) {
    this.companyForm = this.fb.group({
      company_id: [''],
      year: [''],
      type_name: [''],
      term: [''],
      company_name: [''],
      send_name: [''],
      send_coordinator: [''],
      send_position: [''],
      send_tel: [''],
      send_email: [''],
      send_mobile: ['']
    });

    this.internalCompanyForm = this.fb.group({
      company_building: ['', Validators.required],
      company_job: ['', Validators.required],
      number_student_train: ['', Validators.required],
      date_addtraining: ['', [Validators.required]],
      date_endtraining: ['', Validators.required]
    });
  }

  ngOnInit() {
    const companyId = this.route.snapshot.params['company_id'];
    console.log('Company ID:', companyId);
    this.getCompanyData(companyId);
    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);
    // if (!this.username) {
    //   this.router.navigateByUrl('/login-officer', { replaceUrl: true });
    //   return;
    // }
  }

  //get ข้อมูลหน่วยงานโดยดึงข้อมูลหน่วยงานจาก add-company โดยดึง company_id เดียวกัน
  getCompanyData(companyId: string): void {
    this.http.get<CompanyResponse>(`http://localhost/PJ/Backend/Officer/Company/company-detail.php?company_id=${companyId}`)
      .subscribe((response: CompanyResponse) => {
        if (response.success) {
          console.log(response.data);

          this.companyData = response.data.company;

          // Set initial form values
          this.companyForm.patchValue({
            company_id: this.companyData.company_id,
            company_name: this.companyData.company_name,
            send_name: this.companyData.send_name,
            send_coordinator: this.companyData.send_coordinator,
            send_position: this.companyData.send_position,
            send_tel: this.companyData.send_tel,
            send_email: this.companyData.send_email,
            send_mobile: this.companyData.send_mobile,
          });
        } else {
          console.error('Server error:', response);
        }
      }, (error) => {
        console.error('HTTP Error:', error);
      });
  }

  populateFormWithData() {
    // Populate the form fields with existing company data
    this.internalCompanyForm.patchValue({
      company_building: this.CompanyInformation.company_building,
      company_job: this.CompanyInformation.company_job,
      // Populate other fields if available in CompanyInformation
    });
  }

  //get ข้อมูลหน่วยงานจาก add-company
  fetchCompanyData(companyId: string) {
    console.log('Fetching data for company ID:', companyId);
    // Fetch existing company data using companyId
    return this.http.get(`http://localhost/PJ/Backend/Officer/Company/get-company-officer.php?company_id=${companyId}`);
  }

  //open popup when cilck button
  openAddInternalPopup(): void {
    this.DataStorageService.getCompanyInformation().subscribe((companyData: any) => {
      if (this.internalCompanyForm.valid && companyData) {
        const formattedDateAddTraining = this.internalCompanyForm.value.date_addtraining ?
          formatDate(this.internalCompanyForm.value.date_addtraining, 'yyyy-MM-dd', 'en-US') : '';

        const formattedDateEndTraining = this.internalCompanyForm.value.date_endtraining ?
          formatDate(this.internalCompanyForm.value.date_endtraining, 'yyyy-MM-dd', 'en-US') : '';

        const dialogRef = this.dialog.open(DialogComponent, {
          data: {
            company: {
              company_id: this.companyData.company_id,
              company_name: this.companyForm.value.company_name,
              send_name: this.companyForm.value.send_name,
              send_coordinator: this.companyForm.value.send_coordinator,
              send_position: this.companyForm.value.send_position,
              send_tel: this.companyForm.value.send_tel,
              send_email: this.companyForm.value.send_email,
              send_mobile: this.companyForm.value.send_mobile,
              company_building: this.internalCompanyForm.value.company_building,
              company_job: this.internalCompanyForm.value.company_job,
            },
            need_student: {
              number_student_train: this.internalCompanyForm.value.number_student_train,
              date_addtraining: formattedDateAddTraining,
              date_endtraining: formattedDateEndTraining,
            }
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result && result.saveData) {
            this.saveInternal();
          }
        });
      } else {
        this.snackBar.open('กรุณากรอกข้อมูลให้ครบถ้วน', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  //บันทึกข้อมูลทั้งหมด
  saveInternal(): void {
    // Step 1: Update company data
    const formDataCompany = new FormData();
    formDataCompany.append('company_id', this.companyData.company_id); // Use this.company instead of this.companyForm.value
    formDataCompany.append('company_building', this.internalCompanyForm.value.company_building);
    formDataCompany.append('company_job', this.internalCompanyForm.value.company_job);

    this.http.post('http://localhost/PJ/Backend/Officer/Company/update-company.php', formDataCompany)
      .subscribe((companyResponse: any) => {
        if (companyResponse.success) {
          console.log(companyResponse.message);

          // Step 2: Insert need_student data
          const formattedDateAddTraining = this.internalCompanyForm.value.date_addtraining ?
            formatDate(this.internalCompanyForm.value.date_addtraining, 'yyyy-MM-dd', 'en-US') : '';

          const formattedDateEndTraining = this.internalCompanyForm.value.date_endtraining ?
            formatDate(this.internalCompanyForm.value.date_endtraining, 'yyyy-MM-dd', 'en-US') : '';

          const formDataNeedStudent = new FormData();
          formDataNeedStudent.append('company_id', this.companyData.company_id);
          formDataNeedStudent.append('number_student_train', this.internalCompanyForm.value.number_student_train);
          formDataNeedStudent.append('date_addtraining', formattedDateAddTraining);
          formDataNeedStudent.append('date_endtraining', formattedDateEndTraining);

          this.http.post('http://localhost/PJ/Backend/Officer/Company/add-internal-company.php', formDataNeedStudent)
            .subscribe((needStudentResponse: any) => {
              if (needStudentResponse.success) {
                console.log(needStudentResponse.message);
                this.router.navigate(['/home-officer']);
              } else {
                console.error(needStudentResponse.message);
              }
            }, (needStudentError: any) => {
              console.error('HTTP Error (Inserting Need Student):', needStudentError);
            });
        } else {
          console.error(companyResponse.message);
        }
      }, (companyError: any) => {
        console.error('HTTP Error (Updating Company):', companyError);
      });
  }

  //ปฏิทิน
  openDatePicker() {
  }

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');
          this.router.navigate(['/login-officer']);
        },
        (error) => {
          console.error('Logout error:', error);
        }
      );
  }
}