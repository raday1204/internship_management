import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStorageService } from '../data-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyStudentService } from 'src/app/Student/General/search-company-student/company-student/company-student.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent {
  company: any = {
    company_id: null,
    year: '',
    type_name: '',
    term: '',
    company_name: '',
    send_name: '',
    send_coordinator: '',
    send_position: '',
    send_tel: '',
    send_email: '',
    send_mobile: ''
  };
  companyForm: FormGroup;
  selectedOption2: any;
  selectedOption3: any;
  username: string = '';
  loggedInUsername: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private DataStorageService: DataStorageService,
    private companyStudentService: CompanyStudentService
  ) {
    this.companyForm = this.fb.group({
      year: ['', Validators.required],
      type_name: ['', Validators.required],
      term: ['', Validators.required],
      company_name: ['', Validators.required],
      send_name: ['', Validators.required],
      send_coordinator: ['', Validators.required],
      send_position: ['', Validators.required],
      send_tel: [''],
      send_email: [''],
      send_mobile: ['', [Validators.minLength(10), Validators.maxLength(10), this.validateMobileNumber]]
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

  //บันทึกข้อมูลหน่วยงวาน
  saveCompany() {
    if (this.companyForm.valid) {
      const formData = new FormData();
      formData.append('year', this.companyForm.value.year);
      formData.append('type_name', this.companyForm.value.type_name);
      formData.append('term', this.companyForm.value.term);
      formData.append('company_name', this.companyForm.value.company_name);
      formData.append('send_name', this.companyForm.value.send_name);
      formData.append('send_coordinator', this.companyForm.value.send_coordinator);
      formData.append('send_position', this.companyForm.value.send_position);
      formData.append('send_tel', this.companyForm.value.send_tel);
      formData.append('send_email', this.companyForm.value.send_email);
      formData.append('send_mobile', this.companyForm.value.send_mobile);

      console.log('formData:', formData);

      this.http.post('http://localhost/PJ/Backend/Officer/Company/add-company.php', formData, { responseType: 'text' })
        .subscribe(
          (response: any) => {
            console.log('Response:', response);

            try {
              const parsedResponse = JSON.parse(response);
              if (parsedResponse.success) {
                console.log(parsedResponse.message);
                this.DataStorageService.setCompanyInformation(parsedResponse);
                this.company.company_id = parsedResponse.company_id;
                // Pass company information to the route using navigate method
                this.router.navigate(['/add-internal-company', this.company.company_id]);
              }
            } catch (error) {
              console.error('Error parsing JSON response:', error);
            }
          },
          (error) => {
            console.error('HTTP Error:', error);
            // Handle errors
          }
        );
    } else {
      this.snackBar.open('กรุณากรอกข้อมูลให้ครบถ้วน', 'Close', {
        duration: 3000,
      });
    }
  }

  //get type_name, company_name for select options
  getOptions() {
    this.http.get('http://localhost/PJ/Backend/Officer/Company/get-company-officer.php').subscribe(
      (data: any) => {
        const uniqueTypeNames = new Set(data.type_names);
        const uniqueCompanyNames = new Set(data.data.map((item: any) => item.company_name));

        this.selectedOption2 = Array.from(uniqueTypeNames).sort();
        this.selectedOption3 = Array.from(uniqueCompanyNames).sort();
      },
      (error) => {
        console.error('HTTP Error:', error);
      }
    );
  }

  validateMobileNumber(control: FormControl) {
    const mobileNumberPattern = /^[0-9]*$/;
    if (!mobileNumberPattern.test(control.value)) {
      return { invalidMobileNumber: true };
    }
    return null;
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