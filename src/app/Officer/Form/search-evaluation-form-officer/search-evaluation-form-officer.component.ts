import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStorageService } from 'src/app/Officer/General/search-company-officer/company-information/data-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search-evaluation-form-officer',
  templateUrl: './search-evaluation-form-officer.component.html',
  styleUrls: ['./search-evaluation-form-officer.component.css']
})
export class SearchEvaluationFormOfficerComponent {
  selectedOption2: any;
  searchForm: FormGroup;
  username: string = '';
  loggedInUsername: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataStorageService: DataStorageService
  ) {
    this.searchForm = this.formBuilder.group({
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
  //get option select
  getOptions() {
    this.http.get('http://localhost/PJ/Backend/Officer/Company/get-company.php').subscribe(
      (data: any) => {
        if (data.success) {
          if (Array.isArray(data.data)) {
            // Create a Set to store unique values for selectedOption1 and selectedOption2
            const uniqueTypeNames = new Set(data.data.map((item: any) => item.type_name));

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

  //submit form option select
  submitForm() {
    // Check if the form is valid
    if (this.searchForm.invalid) {
      this.snackBar.open('กรุณาเลือกประเภท', 'Close', {
        duration: 3000,
      });
      return;
    }

    const selectedTypeName = this.searchForm.value.selectedOption2;

    this.http.post('http://localhost/PJ/Backend/Officer/Company/post-company.php', { type_name: selectedTypeName })
      .subscribe(
        (response: any) => {
          console.log('Backend Response:', response);

          if (response.success && response.data && response.data.company.length > 0) {
            // Assuming you only need the company data, not student and need_student
            this.dataStorageService.setTypecode(selectedTypeName);

            this.router.navigate(['/evaluation-form'], {
              relativeTo: this.route,
              queryParams: {
                type_name: selectedTypeName
              },
              queryParamsHandling: 'merge'
            });
          } else {
            // Display Snackbar if there are no companies for the selected type_name
            this.snackBar.open(`ไม่มีรายชื่อหน่วยงานประเภท ${selectedTypeName}`, 'Close', {
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