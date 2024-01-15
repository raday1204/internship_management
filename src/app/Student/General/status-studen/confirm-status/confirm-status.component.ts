import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyStudentService } from '../../search-company-student/company-student/company-student.service';


@Component({
  selector: 'app-confirm-status',
  templateUrl: './confirm-status.component.html',
  styleUrls: ['./confirm-status.component.css']
})
export class ConfirmStatusComponent {
  username: string | undefined;
  company = {
    company_id: '',  // Fix the typo here
    company_name: '',
    company_building: ''
  };
  errorMessage: string | undefined;
  companyForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private companyStudentService: CompanyStudentService
  ) {
    this.companyForm = this.fb.group({
      company_id: [''],
      company_name: [''],
      company_building: [''],
    });
  }

  ngOnInit(): void {
    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);

    if (!this.username) {
      this.router.navigate(['/login-student']);
    }

    if (this.username) {
      this.http
        .get(`http://localhost/PJ/Backend/Student/Training/get-training.php?username=${this.username}`)
        .subscribe(
          (response: any) => {
            if (response && response.success) {
              const company = response.data;
              this.companyForm.patchValue({
                company_id: company.company_id,
                company_name: company.company_name,
                company_building: company.company_building,
              });
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

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');
          localStorage.removeItem('companyID');
          // Replace the current navigation history with the login page
          this.router.navigateByUrl('/login-student', { replaceUrl: true });
        },
        (error) => {
          console.error('Logout error:', error);
        }
      );
  }
}