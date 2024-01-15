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
    private snackBar: MatSnackBar,
    private companyStudentService: CompanyStudentService,
    private pdfService: NgxExtendedPdfViewerService
  ) { }

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

  // fetchData() {
  //   if (this.selectedOption5 && this.selectedOption6) {
  //     this.http.get(`http://localhost/PJ/Backend/Officer/Calendar/get-calendar.php?year=${this.selectedOption5}&term=${this.selectedOption6}`)
  //       .subscribe(
  //         (response: any) => {
  //           console.log('Backend Response:', response);

  //           if (response && response.success && response.data && response.data.pdfPath) {
  //             console.log('Backend Response:', response.data.pdfPath);
  //             // Set the PDF URL
  //             this.pdfSrc = response.data.pdfPath;
  //         } else {
  //             console.error('Invalid response from the server.');
  //             this.router.navigate(['/search-calendar-student']);
  //           }
  //         },
  //         (error) => {
  //           console.error('HTTP Error:', error);
  //         }
  //       );
  //   }
  // }

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