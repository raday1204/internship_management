import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CompanyStudentService } from 'src/app/Student/General/search-company-student/company-student/company-student.service';

@Component({
  selector: 'app-company-form-student-print',
  templateUrl: './company-form-student-print.component.html',
  styleUrls: ['./company-form-student-print.component.css']
})
export class CompanyFormStudentPrintComponent {
  company: any = {
    company_id: '',
    year: '',
    type_name: '',
    term: '',
    company_name: '',
    send_name: '',
    send_coordinator: '',
    send_position: '',
    send_tel: '',
    send_email: '',
    send_mobile: '',
    type_position: '',
    type_special: '',
  };
  need_student: any = {
    date_addtraining: ''
  };
  student: any = {
    type_name: '',
    student_code: '',
    student_name: '',
    student_lastname: '',
    depart_name: '',
    student_pak: '',
    student_mobile: '',
    student_facebook: '',
  };
  companyForm: FormGroup;
  studentyForm: FormGroup;
  studentData: any;
  username: string | undefined;
  errorMessage: string | undefined;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private companyStudentService: CompanyStudentService
  ) {
    this.studentyForm = this.fb.group({
      type_name: [''],
      student_code: [''],
      student_name: [''],
      student_lastname: [''],
      depart_name: [''],
      student_pak: [''],
      student_mobile: [''],
      student_facebook: [''],
    });
    this.companyForm = this.fb.group({
      year: [''],
      type_name: [''],
      term: [''],
      company_name: [''],
      send_name: [''],
      send_coordinator: [''],
      send_position: [''],
      send_tel: [''],
      send_email: [''],
      send_mobile: [''],
      type_position: [''],
      type_special: [''],
      date_addtraining: ['']
    });
  }

  ngOnInit(): void {
    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);
    if (!this.username) {
      this.router.navigateByUrl('/login-student', { replaceUrl: true });
      return;
    }

    if (this.username) {
      this.http
        .get(`http://localhost/PJ/Backend/Student/Company-Form/get-company-form-student.php?username=${this.username}`)
        .subscribe(
          (response: any) => {
            if (response && response.success) {
              this.studentyForm.patchValue(response.data);
              this.companyForm.patchValue(response.data.company);
              // Now, fetch is completed, trigger printing
              const printSection = document.getElementById('print-section');
              if (printSection) {
                printSection.innerHTML = this.generatePrintableHtml(response.data);
                this.printDocument();
              }
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

  printDocument() {
    if (this.studentyForm.valid && this.companyForm.valid) {
      const printContents = document.getElementById('print-section')?.innerHTML;
      const originalContents = document.body.innerHTML;

      if (printContents) {
        document.body.innerHTML = printContents;
        window.print();
      }
      document.body.innerHTML = originalContents;
    } else {
      this.router.navigate(['/company-form-student']);
    }
  }

  generatePrintableHtml(data: any): string {
    const student = data || {};
    const company = data.company || {};
    return `
    <body class="mx-auto d-block" style="width: 980px;">
    <div class="main-container" id="print-section">
        <!-- <li>ประเภทที่  นิสิตที่ออกฝึกงานในภาคเรียนที่ </li> แถบข้าง -->
        <div class="head-list">
            01 ข้อมูลหน่วยงาน
            แบบฟอร์มการศึกษาข้อมูลเบื้องต้นของหน่วยงวานที่ต้องการไปฝึกงาน
            <span>ภาคเรียนที่ ${company.term} ประจำปีการศึกษา ${company.year} ประเภทที่ ${company.type_name}</span>
        </div>

        <p>ข้อมูลนิสิต</p>
        <form [formGroup]="studentyForm">
            <div class="list">
                <label for="student_name">ชื่อ-นามสกุล</label>
                <span>${student.student_name} ${student.student_lastname}</span>
            </div>

            <div class="list">
                <label for="student_code">รหัสประจำตัวนิสิต</label>
                <span>${student.student_code}</span>
            </div>

            <div class="list">
                <label for="depart_name">สาขาวิชาวิศวกรรม</label>
                <span>${student.depart_name}</span>
            </div>

            <div class="list">
                <label for="student_pak">ภาควิชาวิศวกรรม</label>
                <span>${student.student_pak}</span>
            </div>

            <div class="list">
                <label for="student_mobile">เบอร์โทรศัพท์นิสิตที่สามารถติดต่อได้</label>
                <span>${student.student_mobile}</span>
            </div>

            <div class="list">
                <label for="student_facebook">Facebook: </label>
                <span>${student.student_facebook}</span>
            </div>

            <form [formGroup]="companyForm">
                <p>ข้อมูลหน่วยงาน</p>

                <div class="list">
                    <label for="company_name">1. ชื่อหน่วยงาน(ภาษาไทย)</label>
                    <span>${company.company_name}</span>
                </div>

                <div class="list">
                    <li>2. ชื่อหรือตำแหน่งที่จะออกหนังสือราชการถึงหน่วยงาน (นิสิตจะต้องสอบถามหน่วยงาน
                        ว่าให้ทำหนังสือถึงใคร)
                    </li>
                </div>

                <div class="list">
                    <label for="send_name">เรียน</label>
                    <span>${company.send_name}</span>
                </div>

                <div class="list">
                    <li>ชื่อผู้ประสานงาน คือ บุคคลที่นิสิตติดต่อหรือโทรศัพท์สอบถามข้อมูลเบื้องต้น</li>
                </div>

                <div class="list">
                    <label for="send_coordinator">ชื่อผู้ประสานงาน</label>
                    <span>${company.send_coordinator}</span>
                </div>

                <div class="list">
                    <label for="send_position">ตำแหน่ง</label>
                    <span>${company.send_position}</span>
                </div>

                <div class="list">
                    <label for="send_tel">เบอร์โทรศัพท์หน่วยงาน</label>
                    <span>${company.send_tel}</span>
                </div>

                <div class="list">
                    <label for="send_email">หรือ E-mail</label>
                    <span>${company.send_email}</span>
                </div>

                <div class="list">
                    <label for="send_mobile">เบอร์มือถือ</label>
                    <span>${company.send_mobile}</span>
                </div>

                <div class="list">
                    <label for="type_position">3. ตำแหน่ง/หน้าที่/ลักษณะงานของนิสิตที่เข้าไปฝึกงาน</label>
                    <span>${company.type_position}</span>
                </div>

                <div class="list">
                    <label for="type_special">4. คุณสมบัติพิเศษ/ความสามารถ/ความรู้เพิ่มเติม
                        ของนิสิตที่หน่วยงานต้องการ(ถ้ามี)</label>
                        <span>${company.type_special}</span>
                </div>

                <div class="list">
                    <label for="student">นิสิต</label>
                    (..............................)
                    วันที่ เดือน พ.ศ.
                </div>

                <div class="list">
                    <label for="officer">อาจารย์ผู้รับรอง</label>
                    (..............................)
                    วันที่ เดือน พ.ศ.
                </div>

                <div class="text">
                    <li>หมายเหตุ&nbsp;&nbsp;ก่อนส่งให้ภาควิชาเพื่อกรอกข้อมูลลงในระบบ นิสิตควรถ่ายสำเนาเก็บไว้ 1 ชุด</li>
                    <li style="margin-left: 77px;">กรณีที่ไปฝึกงานสถานที่เดียวหลายคน ขอให้นิสิตรวบรวมส่งพร้อมกัน</li>
                    <li style="margin-left: 77px;">ส่งงานกิจจการนิสิตและศิษย์เก่าสัมพันธ์ &nbsp;คณะวิศวกรรมศาสตร์&nbsp;
                        เพื่อขอออกหนังสือราชการส่งให้หน่วยงาน</li>
                </div>
            </form>
        </form>
    </div>
</body>
    `;
  }

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');
          localStorage.removeItem('companyID');
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