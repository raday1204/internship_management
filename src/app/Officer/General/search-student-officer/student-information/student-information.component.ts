import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStorageService } from '../../search-company-officer/company-information/data-storage.service';
import { CompanyStudentService } from 'src/app/Student/General/search-company-student/company-student/company-student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.css']
})
export class StudentInformationComponent implements OnInit {
  StudentInformation: any[] = [];
  displayedStudentInformation: any[] = [];
  selectedOption3: any;
  selectedOption4: any;
  username: string = '';
  studentInformation: any;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dataStorageService: DataStorageService,
    private companyStudentService: CompanyStudentService
  ) { }

  ngOnInit() {
    const studentInformation = this.dataStorageService.getStudentInformation();

    if (studentInformation) {
      this.StudentInformation = studentInformation.student;
      this.selectedOption3 = studentInformation.year;
      this.selectedOption4 = studentInformation.type_name;
    }

    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);

    if (!this.username) {
      this.router.navigateByUrl('/  home-officer', { replaceUrl: true });
      return;
    }

    this.route.queryParams.subscribe(params => {
      const studentInformationString = params['StudentInformation'];
      if (studentInformationString) {
        this.studentInformation = JSON.parse(studentInformationString);
        console.log('Year:', this.studentInformation.year);
        console.log('Type Name:', this.studentInformation.type_name);

        // Load student information based on query params
        this.loadStudentInformation();
        this.totalItems = this.StudentInformation.length;
      }
    });
  }

  handleStudentClick(student: any) {
    this.router.navigate(['/student-detail'], { queryParams: { student_code: student.student_code } });
  }

  loadStudentInformation(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedStudentInformation = this.StudentInformation.slice(startIndex, endIndex);
  }

  showStudentsWithCompany() {
    this.fetchAllStudents(this.studentInformation.year, this.studentInformation.type_name);
  }

  fetchAllStudents(year: string, typeName: string) {
    const url = `http://localhost/PJ/Backend/Officer/Student/get-all-students.php?year=${year}&type_name=${typeName}`;

    this.http.get<any>(url).subscribe(
      (response: any) => {
        if (response && response.success && response.data) {
          this.StudentInformation = response.data;
          this.displayedStudentInformation = this.StudentInformation;
          this.totalItems = this.StudentInformation.length;
          this.exportToExcel();
        } else {
          this.snackBar.open('ไม่มีรายชื่อนิสิต', 'Close', {
            duration: 3000,
          });
        }
      },
      (error) => {
        console.error('HTTP Error:', error);
      }
    );
  }

  showStudentsWithoutCompany() {
    this.fetchStudentData(this.studentInformation.year, this.studentInformation.type_name);
  }

  fetchStudentData(year: string, typeName: string) {
    const url = `http://localhost/PJ/Backend/Officer/Student/get-students-without-company.php?year=${year}&type_name=${typeName}`;

    this.http.get<any>(url)
      .subscribe(
        (response: any) => {
          if (response.success && response.data) {
            this.StudentInformation = response.data;
            this.displayedStudentInformation = this.StudentInformation;
            this.totalItems = this.StudentInformation.length;
            this.exportToExcel();
          } else {
            this.snackBar.open('ไม่มีรายชื่อนิสิต', 'Close', {
              duration: 3000,
            });
          }
        },
        (error) => {
          console.error('HTTP Error:', error);
        }
      );
  }

  exportToExcel(): void {
    // Extract specific columns from StudentInformation
    const dataToExport = this.StudentInformation.map(({ student_code, student_name, company_id }) => ({
      student_code,
      student_name,
      company_id
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    // Generate buffer
    const buf: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Save to file
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    saveAs(blob, 'students.xlsx');
  }

  exportStudent(): void {
    // Extract specific columns from StudentInformation
    const dataToExport = this.StudentInformation.map(({ student_code, student_name, company_id }) => ({
      student_code,
      student_name,
      company_id
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    // Generate buffer
    const buf: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Save to file
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    saveAs(blob, 'students.xlsx');
  }

  selectedButton: string = 'all';

onClick(button: string) {
  this.selectedButton = button;
  
  // Call the corresponding function based on the clicked button
  switch (button) {
    case 'all':
      this.ngOnInit();
      break;
    case 'withCompany':
      this.showStudentsWithCompany();
      break;
    case 'withoutCompany':
      this.showStudentsWithoutCompany();
      break;
    case 'export':
      this.exportStudent();
      break;
    default:
      break;
  }
}
  
  paginate(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.loadStudentInformation();
  }

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');
          history.pushState('', '', window.location.href);
          window.onpopstate = function () {
            history.go(1);
          };
          this.companyStudentService.setUsername('');
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