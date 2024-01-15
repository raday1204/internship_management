import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CompanyStudentService } from 'src/app/Student/General/search-company-student/company-student/company-student.service';

interface NeedStudent {
  number_student_train: string;
}

interface Company {
  selected: boolean;
  company_id: string;
  company_name: string;
  company_building: string;
}

interface Student {
  company_id: string;
  student_code: string;
  student_name: string;
  student_lastname: string;
  student_mobile: string;
}

interface CompanyInformation {
  company: Company;
  students: Student[];
  need_students: NeedStudent[];
}

interface CompanyResponse {
  success: boolean;
  data: CompanyInformation[];
}

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.css']
})
export class CompanyInformationComponent implements OnInit {
  need_student: { [key: string]: NeedStudent[] } = {};
  CompanyInformation: CompanyInformation[] = [];
  student: { [key: string]: Student[] } = {};
  selectedOption1: string | undefined;
  selectedOption2: string | undefined;
  username: string = '';

  displayedCompanyInformation: any[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private companyStudentService: CompanyStudentService
  ) {  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedOption1 = params['year'];
      this.selectedOption2 = params['type_name'];
    });
    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);
    this.fetchData();

    if (!this.username) {
      this.router.navigateByUrl('/login-officer', { replaceUrl: true });
      return;
    }
  }

  fetchData() {
    if (this.selectedOption1 && this.selectedOption2) {
      this.http.get<CompanyResponse>(`http://localhost/PJ/Backend/Officer/Company/get-company-information.php?year=${this.selectedOption1}&type_name=${this.selectedOption2}`)
        .subscribe(
          (response: CompanyResponse) => {
            console.log('Backend Response:', response);
  
            if (response && response.success) {
              if (Array.isArray(response.data)) {
                this.CompanyInformation = response.data;

                this.CompanyInformation.forEach(company => {
                  this.need_student[company.company.company_id] = company.need_students;
                  this.student[company.company.company_id] = company.students;
                });

                // Sort the data alphabetically by company name (Thai)
              this.CompanyInformation.sort((a, b) => a.company.company_name.localeCompare(b.company.company_name, 'th'));

              this.loadCompanyInformation();
              this.totalItems = this.CompanyInformation.length;

              } else {
                console.error('Invalid data structure in the server response.');
              }
            } else {
              console.error('Invalid response from the server.');
            }
          },
          (error) => {
            console.error('HTTP Error:', error);
          }
        );
    }
  }

  editCompany(companyId: string) {
    if (companyId) {
      console.log('Invalid company ID.', companyId);
      this.router.navigate(['/edit-company', companyId]);
    } else {
      console.error('Invalid company ID.');
    }
  }

  loadCompanyInformation(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.displayedCompanyInformation = this.CompanyInformation.slice(startIndex, endIndex);
  }

  paginate(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.loadCompanyInformation();
  }

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');

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

          this.router.navigate(['/login-officer'], navigationExtras);
        },
        (error) => {
          console.error('Logout error:', error);
        }
      );
  }
}