import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStorageService } from 'src/app/Officer/General/search-company-officer/company-information/data-storage.service';
import { CompanyStudentService } from '../search-company-student/company-student/company-student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-calendar-student',
  templateUrl: './search-calendar-student.component.html',
  styleUrls: ['./search-calendar-student.component.css']
})
export class SearchCalendarStudentComponent {
  username: string = '';
  selectedOption5: any;
  selectedOption6: any;
  CompanyInformation: any[] = [];
  searchForm: FormGroup;
  pdfSrc: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private dataStorageService: DataStorageService,
    private companyStudentService: CompanyStudentService
  ) {
    this.searchForm = this.formBuilder.group({
      selectedOption5: ['', Validators.required],
      selectedOption6: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);
    this.getOptions();

    if (!this.username) {
      this.router.navigateByUrl('/login-student', { replaceUrl: true });
      return;
    }
  }

  getOptions() {
    this.http.get('http://localhost/PJ/Backend/Officer/Company/get-company-officer.php').subscribe(
      (data: any) => {
        if (data.success) {
          if (Array.isArray(data.data)) {
            // Create a Set to store unique values for selectedOption1 and selectedOption2
            const uniqueYears = new Set(data.data.map((item: any) => item.year));
            const uniqueTerm = new Set(data.data.map((item: any) => item.term));

            this.selectedOption5 = Array.from(uniqueYears);
            this.selectedOption6 = Array.from(uniqueTerm);
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
  submitForm() {
    // Check if the form is valid
    if (this.searchForm.invalid) {
      this.snackBar.open('กรุณาเลือกปีการศึกษาและประเภท', 'Close', {
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('year', this.searchForm.value.selectedOption5);
    formData.append('term', this.searchForm.value.selectedOption6);

    this.http.post('http://localhost/PJ/Backend/Officer/Calendar/post-calendar.php', formData)
      .subscribe((response: any) => {
        console.log('Backend Response:', response);

        // Check if response exists and has the error property
        if (response && response.error) {
          this.snackBar.open('ไม่มีรายชื่อในปีการศึกษาและประเภทที่เลือก', 'Close', {
            duration: 3000,
          });
        } else if (response && response.success) {
          const pdfUrl = response.data && response.data.pdfPath;

          if (pdfUrl) {
            window.open(pdfUrl, '_blank');
            console.log('PDF URL:', pdfUrl);
          } else {
            console.error('PDF Path not found in the response.');
          }
        } else if (response && response.error) {
          this.snackBar.open('ไม่มีรายชื่อในปีการศึกษาและประเภทที่เลือก', 'Close', {
            duration: 3000,
          });
        } else {
          console.error('Invalid response from server.');
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
          localStorage.removeItem('companyID');
          this.searchForm.reset();
          this.username = ''; // Reset username
          this.router.navigateByUrl('/login-student', { replaceUrl: true });
        },
        (error) => {
          console.error('Logout error:', error);
        }
      );
  }
}