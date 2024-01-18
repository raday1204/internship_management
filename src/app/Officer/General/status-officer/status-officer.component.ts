import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStorageService } from '../search-company-officer/company-information/data-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-status-officer',
  templateUrl: './status-officer.component.html',
  styleUrls: ['./status-officer.component.css']
})
export class StatusOfficerComponent {
  selectedOption1: any;
  selectedOption2: any;
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
      selectedOption1: ['', Validators.required],
      selectedOption2: ['', Validators.required],
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
    this.http.get('http://localhost/PJ/Backend/Officer/Company/get-company-officer.php').subscribe(
      (data: any) => {
        if (data.success) {
          if (Array.isArray(data.data)) {
            // Create a Set to store unique values for selectedOption1 and selectedOption2
            const uniqueYears = new Set(data.data.map((item: any) => item.year));
            const uniqueTypeNames = new Set(data.data.map((item: any) => item.type_name));

            this.selectedOption1 = Array.from(uniqueYears);
            this.selectedOption2 = Array.from(uniqueTypeNames);
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

  //post ข้อมูลนิสิตที่เลือกหน่วยงาน
  submitForm() {
    // Check if the form is valid
    if (this.searchForm.invalid) {
      this.snackBar.open('กรุณาเลือกปีการศึกษาและประเภท', 'Close', {
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('year', this.searchForm.value.selectedOption1);
    formData.append('type_name', this.searchForm.value.selectedOption2);

    this.http.post('http://localhost/PJ/Backend/Officer/Company/company-officer.php', formData)
      .subscribe((response: any) => {
        console.log('Backend Response:', response);

        if (response.success && response.data) {
          const companies = response.data.company;
          const students = response.data.students;

          if (companies && companies.length > 0 && students && students.length > 0) {
            // Assuming you only need the company data, not student and need_student
            this.dataStorageService.setYearTypecode(
              this.searchForm.value.selectedOption1,
              this.searchForm.value.selectedOption2
            );

            this.router.navigate(['/status-information'], {
              relativeTo: this.route,
              queryParams: {
                year: this.searchForm.value.selectedOption1,
                type_name: this.searchForm.value.selectedOption2,
              },
              queryParamsHandling: 'merge',
            });
          } else {
            // Display Snackbar if there are no students
            this.snackBar.open('ไม่มีรายชื่อในปีการศึกษาและประเภทที่เลือก', 'Close', {
              duration: 3000,
            });
          }
        } else {
          this.snackBar.open('ไม่มีรายชื่อในปีการศึกษาและประเภทที่เลือก', 'Close', {
            duration: 3000,
          });
        }
      },
        (error) => {
          console.error('HTTP Error:', error);
        });
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