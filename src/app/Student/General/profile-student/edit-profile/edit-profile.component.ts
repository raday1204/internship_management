import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { CompanyStudentService } from '../../search-company-student/company-student/company-student.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditProfilePopupComponent } from './edit-profile-popup/edit-profile-popup.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  selectedFile: File | undefined;

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
  studentForm: FormGroup;
  username: string = '';
  errorMessage: string | undefined;
  displayedFilePath: string | undefined;

  constructor(
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private companyStudentService: CompanyStudentService

  ) {
    this.studentForm = this.fb.group({
      student_id: ['', Validators.required],
      type_name: [''],
      student_name: ['', Validators.required],
      student_lastname: ['', Validators.required],
      student_nickname: ['', Validators.required],
      student_pic: [null, Validators.required],
      student_citizen: ['', Validators.required],
      student_email: ['', Validators.required],
      student_mobile: [''],
      student_facebook: ['', Validators.required],
      student_line: [''],
      st_address: ['', Validators.required],
      st_tambol: ['', Validators.required],
      st_ampher: ['', Validators.required],
      st_province: ['', Validators.required],
      st_zipcode: ['', Validators.required],
      st_tel: [''],
      st_contact: ['', Validators.required],
      st_mobile: [''],
      ct_address: ['', Validators.required],
      ct_tambol: ['', Validators.required],
      ct_ampher: ['', Validators.required],
      ct_province: ['', Validators.required],
      ct_zipcode: ['', Validators.required],
      ct_tel: [''],
    });
  }

  ngOnInit(): void {
    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);
    this.fetchStudentData();

    if (!this.username) {
      this.router.navigateByUrl('/login-student', { replaceUrl: true });
      return;
    }
  }

  private fetchStudentData(): void {
    if (this.username) {
      this.http.get(`http://localhost/PJ/Backend/Student/Profile-Student/profile-student.php?username=${this.username}`)
        .subscribe(
          (response: any) => {
            console.log('Full Response:', response);

            if (response && response.success) {
              this.studentForm.patchValue(response.data);
              this.displayedFilePath = `http://localhost/${response.student_pic}`;
            } else {
              this.errorMessage = response.error || 'An error occurred while fetching student data.';
              console.error('API Error:', this.errorMessage);
            }
          },
          (error) => {
            this.errorMessage = 'An error occurred while fetching student data. Please check your internet connection or try again later.';
            console.error('HTTP Error:', error);
          }
        );
    } else {
      this.errorMessage = 'No username provided.';
    }
  }

  goBack(): void {
    this.location.back();
  }

  updateStudent() {
    if (this.username) {
      const formDataStudent = new FormData();
      formDataStudent.append('type_name', this.studentForm.value.type_name);
      formDataStudent.append('student_name', this.studentForm.value.student_name);
      formDataStudent.append('student_lastname', this.studentForm.value.student_lastname);
      formDataStudent.append('student_nickname', this.studentForm.value.student_nickname);
      formDataStudent.append('student_citizen', this.studentForm.value.student_citizen);
      formDataStudent.append('student_email', this.studentForm.value.student_email);
      formDataStudent.append('student_mobile', this.studentForm.value.student_mobile);
      formDataStudent.append('student_facebook', this.studentForm.value.student_facebook);
      formDataStudent.append('student_line', this.studentForm.value.student_line);

      formDataStudent.append('st_address', this.studentForm.value.st_address);
      formDataStudent.append('st_tambol', this.studentForm.value.st_tambol);
      formDataStudent.append('st_ampher', this.studentForm.value.st_ampher);
      formDataStudent.append('st_province', this.studentForm.value.st_province);
      formDataStudent.append('st_zipcode', this.studentForm.value.st_zipcode);
      formDataStudent.append('st_tel', this.studentForm.value.st_tel);
      formDataStudent.append('st_contact', this.studentForm.value.st_contact);
      formDataStudent.append('st_mobile', this.studentForm.value.st_mobile);

      formDataStudent.append('ct_address', this.studentForm.value.ct_address);
      formDataStudent.append('ct_tambol', this.studentForm.value.ct_tambol);
      formDataStudent.append('ct_ampher', this.studentForm.value.ct_ampher);
      formDataStudent.append('ct_province', this.studentForm.value.ct_province);
      formDataStudent.append('ct_zipcode', this.studentForm.value.ct_zipcode);
      formDataStudent.append('ct_tel', this.studentForm.value.ct_tel);
      formDataStudent.append('file', this.studentForm.value.student_pic);

      formDataStudent.append('username', this.username);

      const url = 'http://localhost/PJ/Backend/Student/Profile-Student/edit-profile.php';

      this.http.post(url, formDataStudent)
        .subscribe(
          (response: any) => {
            console.log(response);
            if (response.success) {
              this.location.back();
            }
          },
          (error) => {
            console.error('Error:', error);
            // Handle errors
          }
        );
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.studentForm.patchValue({ student_pic: file });
      this.displayedFilePath = URL.createObjectURL(file);
    }
  }

  createLocalImageUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  openPopup(): void {
    if (this.studentForm.valid) {
      const dialogRef = this.dialog.open(EditProfilePopupComponent, {
        data: {
          studentData: this.studentForm.value,
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result && result.saveData) {
          this.updateStudent();
        }
      });
    } else {
      this.snackBar.open('กรุณากรอกข้อมูลให้ครบถ้วน', 'Close', {
        duration: 3000,
      });
    }
  }

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');
          localStorage.removeItem('companyID');
          // Disable browser back
          history.pushState('', '', window.location.href);
          window.onpopstate = function () {
            history.go(1);
          };
          this.companyStudentService.setUsername('');
          // Navigate to login-student
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