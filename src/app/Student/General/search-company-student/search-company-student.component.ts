import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStorageService } from 'src/app/Officer/General/search-company-officer/company-information/data-storage.service';
import { CompanyStudentService } from './company-student/company-student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-company-student',
  templateUrl: './search-company-student.component.html',
  styleUrls: ['./search-company-student.component.css']
})
export class SearchCompanyStudentComponent {
  username: string = '';
  selectedOption5: any;
  selectedOption6: any;
  CompanyInformation: any[] = [];
  searchForm: FormGroup;

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

  //get yaer and typename for select options
  getOptions() {
    this.http.get('http://localhost/PJ/Backend/Officer/Company/get-company-officer.php').subscribe(
      (data: any) => {
        if (data.success) {
          if (Array.isArray(data.data)) {
            // Create a Set to store unique values for selectedOption1 and selectedOption2
            const uniqueYears = new Set(data.data.map((item: any) => item.year));
            const uniqueTypeNames = new Set(data.data.map((item: any) => item.type_name));

            this.selectedOption5 = Array.from(uniqueYears);
            this.selectedOption6 = Array.from(uniqueTypeNames);
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

  //post company for select options
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
    formData.append('type_name', this.searchForm.value.selectedOption6);

    this.http.post('http://localhost/PJ/Backend/Officer/Company/company-officer.php', formData)
      .subscribe((response: any) => {
        console.log('Backend Response:', response);
        if (response.error) {
          this.snackBar.open('ไม่มีรายชื่อในปีการศึกษาและประเภทที่เลือก', 'Close', {
            duration: 3000,
          });
        } else if (response.success && response.data && response.data.company && response.data.company.length > 0) {
          // Assuming you only need the company data, not student and need_student
          this.dataStorageService.setYearTypecode(this.searchForm.value.selectedOption5, this.searchForm.value.selectedOption6);

          this.router.navigate(['/company-student'], {
            relativeTo: this.route,
            queryParams: {
              year: this.searchForm.value.selectedOption5,
              type_name: this.searchForm.value.selectedOption6
            },
            queryParamsHandling: 'merge'
          });
        } else {
          this.snackBar.open('ไม่มีรายชื่อหน่วยงานในปีการศึกษาและประเภทที่เลือก', 'Close', {
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