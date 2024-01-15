import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationBehaviorOptions, NavigationExtras, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-student',
  templateUrl: './profile-student.component.html',
  styleUrls: ['./profile-student.component.css']
})
export class ProfileStudentComponent implements OnInit {
  username: string | undefined;
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
  };
  errorMessage: string | undefined;
  studentForm: FormGroup;
  displayedFilePath: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];

      if (!this.username) {
        // Check queryParams directly instead of subscribing
        const queryParams = this.route.snapshot.queryParams;
        this.username = queryParams['username'];

        if (!this.username) {
          this.router.navigateByUrl('/login-student', { replaceUrl: true });
          return;
        }
      }

      this.fetchStudentData();
    });
  }

  private fetchStudentData(): void {
    if (this.username) {
      this.http.get(`http://localhost/PJ/Backend/Student/Profile-Student/profile-student.php?username=${this.username}`)
        .subscribe(
          (response: any) => {
            if (!response.error) {
              const studentData = response.data;
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
              console.log('Image Path:', response.data.student_pic);
              this.displayedFilePath = `http://localhost/${response.student_pic}`;

            } else {
              this.errorMessage = response.error;
            }
          },
          (error) => {
            this.errorMessage = 'An error occurred while fetching student data.';
          }
        );
    } else {
      this.errorMessage = 'No username provided.';
    }
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

          this.router.navigate(['/login-student'], navigationExtras);
        },
        (error) => {
          console.error('Logout error:', error);
        }
      );
  }
}