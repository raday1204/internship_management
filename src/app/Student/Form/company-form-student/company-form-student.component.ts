import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyStudentService } from '../../General/search-company-student/company-student/company-student.service';
import { CompanyFormStudentPopupComponent } from './company-form-student-popup/company-form-student-popup.component';

@Component({
  selector: 'app-company-form-student',
  templateUrl: './company-form-student.component.html',
  styleUrls: ['./company-form-student.component.css']
})
export class CompanyFormStudentComponent implements OnInit {
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
    date_addtraining: '',
    date_endtraining: ''
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
  selectedOption2: any;
  selectedOption3: any;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private companyStudentService: CompanyStudentService

  ) {
    this.studentyForm = this.fb.group({
      type_name: [''],
      student_code: ['', Validators.required],
      student_name: ['', Validators.required],
      student_lastname: ['', Validators.required],
      depart_name: ['', Validators.required],
      student_pak: ['', Validators.required],
      student_mobile: ['', Validators.required],
      student_facebook: ['', Validators.required],
    });
    this.companyForm = this.fb.group({
      year: ['', Validators.required],
      type_name: ['', Validators.required],
      term: ['', Validators.required],
      company_name: ['', Validators.required],
      send_name: ['', Validators.required],
      send_coordinator: ['', Validators.required],
      send_position: ['', Validators.required],
      send_tel: ['', Validators.required],
      send_email: ['', Validators.required],
      send_mobile: ['', Validators.required],
      type_position: ['', Validators.required],
      type_special: ['', Validators.required],
      date_addtraining: ['', Validators.required],
      date_endtraining: ['', Validators.required]
    });
  }

  //ทำให้เรียกชื่อstudent
  ngOnInit(): void {
    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);
    if (!this.username) {
      this.router.navigateByUrl('/login-student', { replaceUrl: true });
      return;
    }

    if (this.username) {
      this.http
        .get(`http://localhost/PJ/Backend/Student/Company-Form/get-profile-student.php?username=${this.username}`)
        .subscribe(
          (response: any) => {
            if (response && response.success) {
              this.studentyForm.patchValue(response.data);
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
    this.getOptions();
  }

  updateData() {
    if (this.username) {
      // Update student data
      const formDataStudent = new FormData();
      formDataStudent.append('type_name', this.studentyForm.value.type_name);
      formDataStudent.append('student_code', this.studentyForm.value.student_code);
      formDataStudent.append('student_name', this.studentyForm.value.student_name);
      formDataStudent.append('student_lastname', this.studentyForm.value.student_lastname);
      formDataStudent.append('depart_name', this.studentyForm.value.depart_name);
      formDataStudent.append('student_pak', this.studentyForm.value.student_pak);
      formDataStudent.append('student_mobile', this.studentyForm.value.student_mobile);
      formDataStudent.append('student_facebook', this.studentyForm.value.student_facebook);
      formDataStudent.append('username', this.username);

      this.http.post('http://localhost/PJ/Backend/Student/Company-Form/update-company-form-student.php', formDataStudent)
        .subscribe(
          (responseStudent: any) => {
            if (responseStudent.success) {
              console.log(responseStudent.message);

              // Optionally, you can update the form with the latest data
              this.studentyForm.patchValue(responseStudent.data);

              // Proceed with company form data only if student data is successfully updated
              const formattedDateAddTraining = this.companyForm.value.date_addtraining ?
                formatDate(this.companyForm.value.date_addtraining, 'yyyy-MM-dd', 'en-US') : '';

              const formattedDateEndTraining = this.companyForm.value.date_endtraining ?
                formatDate(this.companyForm.value.date_endtraining, 'yyyy-MM-dd', 'en-US') : '';
              // Update company form data
              const formDataCompany = new FormData();
              formDataCompany.append('year', this.companyForm.value.year);
              formDataCompany.append('type_name', this.companyForm.value.type_name);
              formDataCompany.append('term', this.companyForm.value.term);
              formDataCompany.append('company_name', this.companyForm.value.company_name);
              formDataCompany.append('send_name', this.companyForm.value.send_name);
              formDataCompany.append('send_coordinator', this.companyForm.value.send_coordinator);
              formDataCompany.append('send_position', this.companyForm.value.send_position);
              formDataCompany.append('send_tel', this.companyForm.value.send_tel);
              formDataCompany.append('send_email', this.companyForm.value.send_email);
              formDataCompany.append('send_mobile', this.companyForm.value.send_mobile);
              formDataCompany.append('type_position', this.companyForm.value.type_position);
              formDataCompany.append('type_special', this.companyForm.value.type_special);
              formDataCompany.append('date_addtraining', formattedDateAddTraining);
              formDataCompany.append('date_endtraining', formattedDateEndTraining);

              console.log('formDataCompany:', this.companyForm.value);

              this.http.post('http://localhost/PJ/Backend/Student/Company-Form/add-company-form-student.php', formDataCompany)
                .subscribe(
                  (responseCompany: any) => {
                    console.log('Response:', responseCompany);
                    if (responseCompany.success) {
                      console.log(responseCompany.message);

                      // Update student's company ID and type code
                      const updatedCompanyId = responseCompany.company_id;
                      const updatedCompanytypecode = responseCompany.type_name;

                      const formDataUpdateStudent = new FormData();
                      formDataUpdateStudent.append('company_id', updatedCompanyId);
                      formDataUpdateStudent.append('type_name', updatedCompanytypecode);
                      formDataUpdateStudent.append('username', this.username ?? '');

                      this.http.post('http://localhost/PJ/Backend/Student/Company-Form/update-student-company-id.php', formDataUpdateStudent)
                        .subscribe(
                          (responseUpdateStudent: any) => {
                            console.log('Response:', responseUpdateStudent);

                            if (responseUpdateStudent.success) {
                              console.log(responseUpdateStudent.message);

                              const updatedStudentData = responseUpdateStudent.data;
                              console.log('Updated Student Data:', updatedStudentData);

                              // Close the dialog and open a new tab to display data
                              // this.dialogRef.close({ saveData: true });
                              this.openInNewTab(updatedStudentData, responseCompany);
                            } else {
                              console.error(responseUpdateStudent.message);
                            }
                          },
                          (errorUpdateStudent) => {
                            if (errorUpdateStudent instanceof ErrorEvent) {
                              // Client-side error (e.g., network issues)
                              console.error('Client-side error:', errorUpdateStudent.message);
                            } else {
                              // Server-side error
                              console.error('Server-side error:', errorUpdateStudent.error);
                              // You might want to handle errorUpdateStudent.error based on your server response
                            }
                          }
                        );
                    } else {
                      console.error(responseCompany.message);
                    }
                  },
                  (errorCompany) => {
                    console.error('HTTP Error:', errorCompany);
                  }
                );
            } else {
              console.error(responseStudent.message);
            }
          },
          (errorStudent) => {
            console.error('HTTP Error:', errorStudent);
          }
        );
    }
  }

  openPopup(): void {
    if (this.areFormsValid()) {
      const formattedDateAddTraining = this.companyForm.value.date_addtraining ?
        formatDate(this.companyForm.value.date_addtraining, 'yyyy-MM-dd', 'en-US') : '';

      const formattedDateEndTraining = this.companyForm.value.date_endtraining ?
        formatDate(this.companyForm.value.date_endtraining, 'yyyy-MM-dd', 'en-US') : '';
      const dialogRef = this.dialog.open(CompanyFormStudentPopupComponent, {
        data: {
          company: {
            year: this.companyForm.value.year,
            type_name: this.companyForm.value.type_name,
            term: this.companyForm.value.term,
            company_name: this.companyForm.value.company_name,
            send_name: this.companyForm.value.send_name,
            send_coordinator: this.companyForm.value.send_coordinator,
            send_position: this.companyForm.value.send_position,
            send_tel: this.companyForm.value.send_tel,
            send_email: this.companyForm.value.send_email,
            send_mobile: this.companyForm.value.send_mobile,
            type_position: this.companyForm.value.type_position,
            type_special: this.companyForm.value.type_special
          },
          need_student: {
            date_addtraining: formattedDateAddTraining,
            date_endtraining: formattedDateEndTraining,
          },
          student: {
            type_name: this.studentyForm.value.type_name,
            student_code: this.studentyForm.value.student_code,
            student_name: this.studentyForm.value.student_name,
            student_lastname: this.studentyForm.value.student_lastname,
            depart_name: this.studentyForm.value.depart_name,
            student_pak: this.studentyForm.value.student_pak,
            student_mobile: this.studentyForm.value.student_mobile,
            student_facebook: this.studentyForm.value.student_facebook,
          }
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result && result.saveData) {
          this.updateData();
        }
      });
    } else {
      this.snackBar.open('กรุณากรอกข้อมูลให้ครบถ้วน', 'Close', {
        duration: 3000,
      });
    }
  }

  openInNewTab(updatedStudentData: any, responseCompany: any): void {
    const newTab = window.open('', '_blank');
    if (newTab) {
      newTab.document.write(`
        <html>
          <head>
            <title> แบบฟอร์ม 01-ข้อมูลหน่วยงาน </title>
            <!-- Add any styles or meta tags if needed -->
              <style type="text/css">
                <!--
                  .style3 {
                    font-family: "TH SarabunPSK"; 
                    font-size:16px; 
                  }

                  .style8 {
                    font-family: "TH SarabunPSK"; 
                    font-size:18px; 
                  }
                -->
            </style>
          </head>

          <body topmargin="top">
            <table width="620" border="0" align="center">
              <tr>
                <td>
                  <table width="100" border="1" align="right" style="border-collapse: collapse; border-spacing: 0;">
                    <tr>
                      <td align="center">
                        <span class="style3">
                            01 ข้อมูลหน่วยงาน
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td align="center">
                  <span class="style8">
                      <strong> แบบฟอร์มการศึกษาข้อมูลเบื้องต้นของหน่วยงานที่ต้องการไปฝึกงาน </strong><br/>
                      ภาคเรียนที่ ${this.companyForm.value.term} ประจำปีการศึกษา ${this.companyForm.value.year}
                  </span>
                </td>
              </tr>

              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td>
                  <span class="style8">
                      <strong> ข้อมูลนิสิต </strong><br/>
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span class="style3">
                      <strong> ชื่อ-นามสกุล: </strong> &nbsp;&nbsp; ${this.studentyForm.value.student_name} &nbsp; ${this.studentyForm.value.student_lastname} 
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong> รหัสประจำตัวนิสิต: </strong> &nbsp;&nbsp; ${this.studentyForm.value.student_code}
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span class="style3">
                      <strong> สาขาวิชาวิศวกรรม: </strong> &nbsp;&nbsp; ${this.studentyForm.value.depart_name} 
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong> ภาควิชาวิศวกรรม: </strong> &nbsp;&nbsp; ${this.studentyForm.value.student_pak}
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span class="style3">
                      <strong> เบอร์โทรศัพท์นิสิตที่สามารถติดต่อได้: </strong> &nbsp;&nbsp; ${this.studentyForm.value.student_mobile}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong> Facebook: </strong> &nbsp;&nbsp; ${this.studentyForm.value.student_facebook}
                  </span>
                </td>
              </tr>

              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td>
                  <span class="style8">
                      <strong> ข้อมูลหน่วยงาน </strong><br/>
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span class="style3">
                      1. ชื่อหน่วยงาน(ภาษาไทย): &nbsp;&nbsp; ${this.companyForm.value.company_name}
                  </span>
                </td>
              </tr>

              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td>
                  <span class="style3">
                  2. ชื่อหรือตำแหน่งที่จะออกหนังสือราชการถึงหน่วยงาน (นิสิตจะต้องสอบถามหน่วยงานว่าให้ทำหนังสือถึงใคร)
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span class="style3">
                      &nbsp;&nbsp;&nbsp;
                      <strong> เรียน </strong> &nbsp;&nbsp; ${this.companyForm.value.send_name}
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span class="style3">
                      &nbsp;&nbsp;&nbsp;
                      ชื่อผู้ประสานงาน คือ บุคคลที่นิสิตติดต่อหรือโทรศัพท์สอบถามข้อมูลเบื้องต้น
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span class="style3">
                      &nbsp;&nbsp;&nbsp;
                      <strong> ชื่อผู้ประสานงาน: </strong> &nbsp;&nbsp; ${this.companyForm.value.send_coordinator}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong> ตำแหน่ง: </strong> &nbsp;&nbsp; ${this.companyForm.value.send_position}
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span class="style3">
                      &nbsp;&nbsp;&nbsp;
                      <strong> เบอร์โทรศัพท์หน่วยงาน: </strong> &nbsp;&nbsp; ${this.companyForm.value.send_tel}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong> หรือ E-mail: </strong> &nbsp;&nbsp; ${this.companyForm.value.send_email}
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span class="style3">
                      &nbsp;&nbsp;&nbsp;
                      <strong> เบอร์มือถือ: </strong>  &nbsp;&nbsp; ${this.companyForm.value.send_mobile}
                  </span>
                </td>
              </tr>

              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td>
                  <span class="style3">
                  3. ตำแหน่ง/หน้าที่/ลักษณะงานของนิสิตที่เข้าไปฝึกงาน: &nbsp;&nbsp; ${this.companyForm.value.type_position}
                  </span>
                </td>
              </tr>

              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td>
                  <span class="style3">
                  4. คุณสมบัติพิเศษ/ความสามารถ/ความรู้เพิ่มเติม ของนิสิตที่หน่วยงานต้องการ(ถ้ามี): &nbsp;&nbsp; ${this.companyForm.value.type_special}
                  </span>
                </td>
              </tr>

              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>

              <tr>
                  <td>
                      <table width="100%" border="0" align="center">
                          <tr>
                              <td width="250" align="center">
                                  <p class="style3">นิสิต...................................................<br />
                                  (${this.studentyForm.value.student_name} &nbsp; ${this.studentyForm.value.student_lastname})<br />
                                  วันที่........ เดือน.................... พ.ศ..........</p>
                              </td>

                              <td width="250" align="center">
                                  <p class="style3">อาจารย์ผู้รับรอง..............................................<br />
                                  (.................................................)<br />
                                  วันที่........ เดือน.................... พ.ศ..........</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
              
              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              <tr>
                <td><span class="style3">&nbsp;</span></td>
              </tr>
              
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="80">
                          <span class="style3">
                            <strong> หมายเหตุ </strong>
                          </span>
                        </td>
                        <td>
                          <span class="style3">
                            <strong> &nbsp;&nbsp;ก่อนส่งให้ภาควิชาเพื่อกรอกข้อมูลลงในระบบ นิสิตควรถ่ายสำเนาเก็บไว้ 1 ชุด </strong>
                          </span>
                        </td>
                      </tr>
                  </table>
                  </td>
              </tr>

              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="80">
                          <span class="style3">
                            <strong> &nbsp; </strong>
                          </span>
                        </td>
                        <td>
                          <span class="style3">
                            &nbsp;&nbsp;กรณีที่ไปฝึกงานสถานที่เดียวหลายคน ขอให้นิสิตรวบรวมส่งพร้อมกัน <br />
                            &nbsp;&nbsp;ส่งงานกิจจการนิสิตและศิษย์เก่าสัมพันธ์ &nbsp;คณะวิศวกรรมศาสตร์ &nbsp;เพื่อขอออกหนังสือราชการส่งให้หน่วยงาน
                          </span>
                        </td>
                      </tr>
                  </table>
                  </td>
              </tr>

            </table>
          </body>
        </html>
      `);
      newTab.document.close();
    }
  }

  areFormsValid(): boolean {
    return this.studentyForm.valid && this.companyForm.valid;
  }

  printDocument() {
    window.print();
  }

  openDatePicker() {
    console.log('Date picker opened');
  }

  getOptions() {
    this.http.get('http://localhost/PJ/Backend/Officer/Company/get-company-officer.php').subscribe(
      (data: any) => {
        const uniqueTypeNames = new Set(data.type_names);
        const uniqueCompanyNames = new Set(data.data.map((item: any) => item.company_name));

        this.selectedOption2 = Array.from(uniqueTypeNames);
        this.selectedOption3 = Array.from(uniqueCompanyNames);
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
          localStorage.removeItem('companyID');
          this.username = ''; // Reset username
          this.router.navigateByUrl('/login-student', { replaceUrl: true });
        },
        (error) => {
          console.error('Logout error:', error);
        }
      );
  }
}