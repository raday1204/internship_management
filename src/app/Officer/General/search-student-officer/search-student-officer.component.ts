import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStorageService } from '../search-company-officer/company-information/data-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search-student-officer',
  templateUrl: './search-student-officer.component.html',
  styleUrls: ['./search-student-officer.component.css']
})
export class SearchStudentOfficerComponent {
  selectedOption3: any[] = [];
  selectedOption4: any[] = [];
  studentInformation: any[] = [];
  error: string = '';
  username: string = '';
  loggedInUsername: string = '';
  searchForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataStorageService: DataStorageService
  ) {
    this.searchForm = this.formBuilder.group({
      selectedOption3: ['', Validators.required],
      selectedOption4: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loggedInUsername = localStorage.getItem('loggedInUsername') || '';
    this.username = this.loggedInUsername;
    if (!this.username) {
      this.router.navigateByUrl('/login-officer', { replaceUrl: true });
      return;
    }
    this.getOptions();
  }

  //get year and typename for select options 
  getOptions() {
    this.http.get('http://localhost/PJ/Backend/Officer/Student/get-student-officer.php').subscribe(
      (data: any) => {
        if (data.success) {
          if (Array.isArray(data.data)) {
            // Create a Set to store unique values for selectedOption1 and selectedOption2
            const uniqueYears = new Set(data.data.map((item: any) => item.year));
            const uniqueTypeNames = new Set(data.data.map((item: any) => item.type_name));

            this.selectedOption3 = Array.from(uniqueYears);
            this.selectedOption4 = Array.from(uniqueTypeNames);
          } else {
            console.error('Invalid data structure in the API response.');
          }
        } else {
          console.error('API request failed:', data.message);
        }
      },
      (error) => {
        console.error('HTTP Error:', error);
      }
    );
  }

  //post when seclect options succseeful
  submitForm() {
    // Check if the form is valid
    if (this.searchForm.invalid) {
      this.snackBar.open('กรุณาเลือกปีการศึกษาและประเภท', 'Close', {
        duration: 3000,
      });
      return;
    }
    const formData = new FormData();
    formData.append('year', this.searchForm.value.selectedOption3.toString());
    formData.append('type_name', this.searchForm.value.selectedOption4.toString());

    this.http.post('http://localhost/PJ/Backend/Officer/Student/student-officer.php', formData)
      .subscribe(
        (response: any) => {
          console.log('Backend Response:', response);

          if (response.error) {
            this.snackBar.open('ไม่มีรายชื่อในปีการศึกษาและประเภทที่เลือก', 'Close', {
              duration: 3000,
            });

          } else if (response.student && response.student.length > 0) {
            // Save student information in the data storage service
            this.dataStorageService.setStudentInformation({
              year: this.searchForm.value.selectedOption3,
              type_name: this.searchForm.value.selectedOption4,
              student: response.student
            });

            // Navigate to student-information component
            const queryParams = {
              StudentInformation: JSON.stringify({
                year: this.searchForm.value.selectedOption3,
                type_name: this.searchForm.value.selectedOption4,
                student: response.student
              })
            };
            this.router.navigate(['/student-information'], { queryParams: queryParams });
          } else {
            this.snackBar.open('ไม่มีรายชื่อในปีการศึกษาและประเภทที่เลือก', 'Close', {
              duration: 3000,
            });
          }
        },
        (error) => {
          console.error('HTTP Error:', error);
        }
      );
  }

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');
          this.searchForm.reset();
          this.username = ''; // Reset username
          this.router.navigateByUrl('/login-officer', { replaceUrl: true });
        },
        (error) => {
          console.error('Logout error:', error);
        }
      );
  }
}