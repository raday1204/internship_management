import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationBehaviorOptions, NavigationExtras, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  studentCode: string = '';
  displayedFilePath: string = '';
  studentData = {
    student_id: '',
    type_name: '',
    student_name: '',
    student_lastname: '',
    student_nickname: '',
    student_pic: '',
    student_citizen: '',
    student_email: '',
    student_mobile: '',
    student_facebook: '',
    student_line: '',

    st_address: '',
    st_tambol: '',
    st_ampher: '',
    st_province: '',
    st_zipcode: '',
    st_tel: '',
    st_contact: '',
    st_mobile: '',

    ct_address: '',
    ct_tambol: '',
    ct_ampher: '',
    ct_province: '',
    ct_zipcode: '',
    ct_tel: '',

    company_name: '',
    company_building: ''
  };
  errorMessage: string | undefined;
  studentForm: FormGroup;
  companyForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.studentForm = this.fb.group({
      student_id: [''],
      type_name: [''],
      student_name: [''],
      student_lastname: [''],
      student_nickname: [''],
      student_pic: [''],
      student_citizen: [''],
      student_email: [''],
      student_mobile: [''],
      student_facebook: [''],
      student_line: [''],
      st_address: [''],
      st_tambol: [''],
      st_ampher: [''],
      st_province: [''],
      st_zipcode: [''],
      st_tel: [''],
      st_contact: [''],
      st_mobile: [''],
      ct_address: [''],
      ct_tambol: [''],
      ct_ampher: [''],
      ct_province: [''],
      ct_zipcode: [''],
      ct_tel: [''],
    });

    this.companyForm = this.fb.group({
      company_name: [''],
      company_building: [''],
    });
  }

  ngOnInit(): void {
    // Get the student_code from query parameters
    this.route.queryParams.subscribe(params => {
      this.studentCode = params['student_code'] || '';
      console.log('Student Code:', this.studentCode);
      this.fetchStudentData();
    });
  }

  //display student detail
  private fetchStudentData(): void {
    if (this.studentCode) {
      this.http.get(`http://localhost/PJ/Backend/Officer/Student/get-profile-student.php?student_code=${this.studentCode}`)
        .subscribe(
          (response: any) => {
            if (!response.error) {
              const studentData = response.data;

              // Log the entire studentData for debugging
              console.log('Student Data:', studentData);
              console.log('Before Patching:', this.studentForm.value);
              this.studentForm.patchValue({
                student_id: studentData.student_id,
                type_name: studentData.type_name,
                student_name: studentData.student_name,
                student_lastname: studentData.student_lastname,
                student_nickname: studentData.student_nickname,
                student_pic: studentData.student_pic,
                student_citizen: studentData.student_citizen,
                student_email: studentData.student_email,
                student_mobile: studentData.student_mobile,
                student_facebook: studentData.student_facebook,
                student_line: studentData.student_line,
                st_address: studentData.st_address,
                st_tambol: studentData.st_tambol,
                st_ampher: studentData.st_ampher,
                st_province: studentData.st_province,
                st_zipcode: studentData.st_zipcode,
                st_tel: studentData.st_tel,
                st_contact: studentData.st_contact,
                st_mobile: studentData.st_mobile,
                ct_address: studentData.ct_address,
                ct_tambol: studentData.ct_tambol,
                ct_ampher: studentData.ct_ampher,
                ct_province: studentData.ct_province,
                ct_zipcode: studentData.ct_zipcode,
                ct_tel: studentData.ct_tel,
              });
              console.log('Image Path:', studentData.student_pic);
              this.displayedFilePath = `http://localhost/${response.student_pic}`;

              if (studentData.company_data) {
                this.companyForm.patchValue({
                  company_name: studentData.company_data.company_name,
                  company_building: studentData.company_data.company_building,
                });
              }
            } else {
              this.errorMessage = response.error;
            }
          },
          (error) => {
            this.errorMessage = 'An error occurred while fetching student data.';
          }
        );
    } else {
      this.errorMessage = 'No student code provided.';
    }
  }

  goback() {
    this.location.back();
  }

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');
          localStorage.removeItem('companyID');
          // Clear navigation history and prevent going back
          const navigationExtras: NavigationExtras = {
            replaceUrl: true,
            state: {
              clearHistory: true
            }
          };

          this.router.navigate(['/login-officer'], navigationExtras);
        },
        (error) => {
          console.error('Logout error:', error);
        }
      );
  }
}