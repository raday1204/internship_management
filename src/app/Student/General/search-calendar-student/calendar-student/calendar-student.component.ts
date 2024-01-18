import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CompanyStudentService } from '../../search-company-student/company-student/company-student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxExtendedPdfViewerService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-calendar-student',
  templateUrl: './calendar-student.component.html',
  styleUrls: ['./calendar-student.component.css']
})
export class CalendarStudentComponent implements OnInit {
  username: any;
  selectedOption5: any;
  selectedOption6: any;
  pdfSrc: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private companyStudentService: CompanyStudentService
  ) { }

  //display calendar from select options on new tab
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedOption5 = params['year'];
      this.selectedOption6 = params['term'];
      this.pdfSrc = params['pdfUrl'];
      console.log('PDF Source:', this.pdfSrc);
    });

    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);

    if (!this.username) {
      this.router.navigateByUrl('/login-student', { replaceUrl: true });
      return;
    }

    if (this.pdfSrc) {
      window.open(this.pdfSrc, '_blank');
    }
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