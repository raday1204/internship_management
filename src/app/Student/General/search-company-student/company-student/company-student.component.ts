import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CompanyStudentPopupComponent } from './company-student-popup/company-student-popup.component';
import { CompanyStudentService } from './company-student.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface NeedStudent {
  number_student_train: string;
}

interface Company {
  selected: boolean;
  company_id: string;
  company_name: string;
  company_building: string;
  company_job: string;
  students: Student[]; // Add this line
}

interface Student {
  student_code: string;
  student_name: string;
  student_lastname: string;
}

interface CompanyInformation {
  selected: any;
  company: Company;
  students: Student[];
  need_students: NeedStudent[];
}

interface CompanyResponse {
  success: boolean;
  data: CompanyInformation[];
}

@Component({
  selector: 'app-company-student',
  templateUrl: './company-student.component.html',
  styleUrls: ['./company-student.component.css']
})
export class CompanyStudentComponent implements OnInit {
  need_student: { [key: string]: NeedStudent[] } = {};
  companyInformation: CompanyInformation[] = [];
  student: { [key: string]: Student[] } = {};
  username: any;

  selectedOption5: any;
  selectedOption6: any;
  hasSelectedCompany: boolean = false;
  selectedCompany: Company | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private companyStudentService: CompanyStudentService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedOption5 = params['year'];
      this.selectedOption6 = params['type_name'];
    });

    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);
    this.fetchData();

    if (!this.username) {
      this.router.navigateByUrl('/login-student', { replaceUrl: true });
      return;
    }
    const companyID = localStorage.getItem('companyID');
    this.hasSelectedCompany = !!companyID;
    const selectedCompanyID = localStorage.getItem('selectedCompanyID');
    this.hasSelectedCompany = !!selectedCompanyID;
  }


  fetchData() {
    if (this.selectedOption5 && this.selectedOption6) {
      this.http.get<CompanyResponse>(`http://localhost/PJ/Backend/Officer/Company/get-company-information.php?year=${this.selectedOption5}&type_name=${this.selectedOption6}`)
        .subscribe(
          (response: any) => {
            console.log('Backend Response:', response);

            if (response && response.success && response.data) {
              this.companyInformation = response.data;
              this.companyInformation.forEach(company => {
                this.need_student[company.company.company_id] = company.need_students;
                this.student[company.company.company_id] = company.students;
              });
              // Sort the data alphabetically by company name (Thai)
              this.companyInformation.sort((a, b) => a.company.company_name.localeCompare(b.company.company_name, 'th'));

            } else {
              console.error('Invalid response from the server.');
              this.router.navigate(['/search-company-student']);
            }
          },
          (error) => {
            console.error('HTTP Error:', error);
          }
        );
    }
  }

  selectCompany(selectedCompany: CompanyInformation) {
    if (this.username) {
      if (selectedCompany && selectedCompany.company && selectedCompany.company.company_id) {
        if (this.hasSelectedCompany) {
          this.snackBar.open('ไม่สามารถเปลี่ยนแปลงหน่วยงานได้', 'Close', {
            duration: 3000,
            // verticalPosition: 'center' as MatSnackBarVerticalPosition,
          });
          this.router.navigate(['/select-company']);
          return;
        }

        const dialogRef = this.dialog.open(CompanyStudentPopupComponent, {
          data: {
            companyInformation: selectedCompany.company
          }
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed', result);
          if (result && result.saveData) {
            this.selectedCompany = selectedCompany.company;
            this.setSelectedCompany(selectedCompany.company);
            this.hasSelectedCompany = true;
            console.log('Company selected successfully.');
          } else {
            console.log('No data to save or action was canceled.');
            this.snackBar.open('คำเตือน: ไม่สามารถเลือกหน่วยงานได้', 'Close', {
              duration: 3000,
            });
          }
        });
      } else {
        console.error('Invalid company data or missing company_id.');
      }
    }
  }

  private setSelectedCompany(selectedCompany: Company) {

    const insertUrl = 'http://localhost/PJ/Backend/Student/Company/select-company.php';

    const requestData = {
      username: this.username,
      company_id: selectedCompany.company_id
    };

    this.http.post<CompanyResponse>(insertUrl, requestData).subscribe(
      (response) => {
        console.log('Company ID updated successfully:', response);
        if (response.success) {
          this.router.navigate(['/select-company']);
          localStorage.setItem('selectedCompanyID', selectedCompany.company_id);
        }
      },
      (error: HttpErrorResponse) => {
        console.error('HTTP error updating company ID:', error);
        console.error('Detailed error:', error.error);
        // Handle errors
      }
    );
  }

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');
          localStorage.removeItem('selectedCompanyID');
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