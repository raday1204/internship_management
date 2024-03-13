import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CompanyStudentService } from 'src/app/Student/General/search-company-student/company-student/company-student.service';

interface NeedStudent {
  number_student_train: string;
  date_addtraining: string;
  date_endtraining: string;
}

interface Company {
  selected: boolean;
  year: string;
  student_code: string;
  company_id: string;
  company_name: string;
  company_building: string;
}

interface Student {
  company_id: string;
  student_code: string;
  student_name: string;
  student_lastname: string;
  depart_name: string;
  year: string;
}

interface Training {
  student_code: string;
  company_id: string;
  company_status: number;
  assessment_status: number;
}

interface CompanyInformation {
  company: Company;
  students: Student[];
  need_students: NeedStudent[];
  training: Training[];
}

interface CompanyResponse {
  success: boolean;
  data: CompanyInformation[];
}

@Component({
  selector: 'app-notifying-form',
  templateUrl: './notifying-form.component.html',
  styleUrls: ['./notifying-form.component.css']
})
export class NotifyingFormComponent {
  companyInformation: CompanyInformation[] = [];
  student: { [key: string]: Student[] } = {};
  training: { [key: string]: Training[] } = {};
  need_student: { [key: string]: NeedStudent[] } = {};
  selectedOption1: string | undefined;
  selectedOption2: string | undefined;
  username: string = '';
  company: { [companyId: string]: Company } = {};
  currentCompanyId: string = '';
  currentDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private companyStudentService: CompanyStudentService
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date();
    this.route.queryParams.subscribe(params => {
      this.selectedOption1 = params['year'];
      this.selectedOption2 = params['type_name'];
    });
    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);
    this.fetchData();

    if (!this.username) {
      this.router.navigateByUrl('/home-officer', { replaceUrl: true });
      return;
    }
  }

  //ดึงข้อมูลนิสิตในปีการศึกษาและประเภทหน่วยงานที่เลือก
  fetchData() {
    if (this.selectedOption1 && this.selectedOption2) {
      this.http.get<CompanyResponse>(`http://localhost/PJ/Backend/Officer/Company/get-company-information.php?year=${this.selectedOption1}&type_name=${this.selectedOption2}`)
        .subscribe(
          (response: CompanyResponse) => {
            console.log('Backend Response:', response);

            if (response && response.success) {
              if (Array.isArray(response.data)) {
                this.companyInformation = response.data.filter(companyInfo => {
                  // Filter out companies without students
                  return companyInfo.students && companyInfo.students.length > 0;
                });

                // Build the student map for filtered companies
                this.companyInformation.forEach(company => {
                  this.student[company.company.company_id] = company.students;
                  this.need_student[company.company.company_id] = company.need_students;

                  this.company[company.company.company_id] = company.company;

                  this.currentCompanyId = company.company.company_id;
                });
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

  onPrintButtonClick(): void {
    const selectedCompanyNames = this.companyInformation.map(companyInfo => companyInfo.company.company_name);
    if (selectedCompanyNames && selectedCompanyNames.length > 0) {
      this.selectForm(selectedCompanyNames);
    } else {
      console.error('No companies selected for printing.');
    }
  }

  //เลือกพิมพ์เอกสารเฉพาะหน่วยงาน
  selectForm(selectedCompanyNames: string[]): void {
    if (selectedCompanyNames && selectedCompanyNames.length > 0) {
      const newTab = window.open('', '_blank');
      if (newTab) {
        newTab.document.write(`
          <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
          <meta http-equiv="Content-Type" content="text/html; charset=windows-874" />
          <title>หนังสือแจ้งผู้ปกครองเรื่องการฝึกงาน</title>
          <style type="text/css">
            <!--
              .style3 {
                font-family: "TH SarabunPSK"; 
                font-size:14px; 
              }
  
              .style8 {
                font-family: "TH SarabunPSK";
                font-size:18px; 
              }
            -->
          </style>
          </head>
          <body>
        `);
  
        this.companyInformation.forEach(companyInfo => {
          companyInfo.students.forEach(student => {
            const htmlContent = this.generateFileUrl(student, companyInfo.company, companyInfo.need_students);
            newTab.document.body.innerHTML += htmlContent;
          });
        });
  
        newTab.document.write('</body></html>');
      } else {
        console.error('Unable to open new tab.');
      }
    }
  }  

  //สร้างหน้า html เพื่อพิมพ์เอกสาร
  generateFileUrl(student: Student, company: Company, needStudents: NeedStudent[]): string {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const { student_name, student_lastname, student_code, depart_name, year: studentYear } = student;
    const displayedStudentCode = student.student_code.slice(0, 2);
    console.log('Student Year:', studentYear);

    const { company_name, company_building, year: companyYear } = company;

    const datesInfo = needStudents && needStudents.length > 0
      ? needStudents.map(need_student => {
        const startDate = new Date(need_student.date_addtraining);
        const endDate = new Date(need_student.date_endtraining);

        const formattedStartDate = startDate.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const formattedEndDate = endDate.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return `${formattedStartDate} ถึงวันที่ ${formattedEndDate}`;
      }).join(', ')
      : '';

    const htmlContent = `

<!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=windows-874" />
    <title>หนังสือแจ้งผู้ปกครองเรื่องการฝึกงาน</title>
    <style type="text/css">

        .style3 {
            font-family: "TH SarabunPSK";
            font-size: 14px;
        }

        .style6 {
          font-family: "TH SarabunPSK";
          font-size: 16px;
      }

        .style8 {
            font-family: "TH SarabunPSK";
            font-size: 18px;
        }

    </style>
</head>

<body topmargin="top">
    <table width="620" border="0" align="center">
        <tr>
            <td>
                <table width="100%" border="0" align="center">
                    <tr>
                        <td width="200" height="160">
                            <p class="style8">ที่ อว 0603.09/ว.2122</p>
                            <p class="style8">&nbsp;</p>
                        </td>
                        <td valign="top" colspan="2">
                            <div align="center"><img src="http://www.thailibrary.in.th/wp-content/uploads/2013/04/482457_10200601494981789_1825578775_n.jpg" width="79" height="83" /></div>
                            <p>&nbsp;</p>
                        </td>
                        <td width="200">
                            <p class="style3" align="right"><!-- &nbsp;เลขที่ ...................... --></p>
                            <p></p>
                            <p class="style8">คณะวิศวกรรมศาสตร์<br />
                                มหาวิทยาลัยนเรศวร<br />
                                อำเภอเมืองพิษณุโลก<br />
                                จังหวัดพิษณุโลก 65000 </p>
                        </td>
                    </tr>
                    <tr>
                        <td height="28"><span class="style4"></span></td>
                        <td width="100"><span class="style4"></span></td>
                        <td colspan="2"><span class="style8">
                        ${formattedDate} 
                            </span></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td><span class="style3">&nbsp;</span></td>
        </tr>

        <tr>
          <td>
            ${datesInfo && datesInfo.length > 0 ? `
            <table width="600" cellpadding="0" cellspacing="0">
                <tr valign="top">
                    <td width="40"><span class="style8"><strong> เรื่อง </strong></span></td>
                    <td colspan="2"><span class="style8">ขอแจ้งแนวทางปฏิบัติเกี่ยวกับรายวิชาประสบการณ์ภาคสนาม ระหว่างวันที่ ${datesInfo} 
                            สำหรับนิสิตสาขาวิชาวิศวกรรมคอมพิวเตอร์  คณะวิศวกรรมศาสตร์ 
                    </span></td>
                </tr>
            </table>
            ` : ''}
          </td>
        </tr>


        <tr>
            <td><span class="style3">&nbsp;</span></td>
        </tr>
        <tr>
            <td>
                <span class="style8">
                    <strong>เรียน &nbsp;&nbsp; ผู้ปกครองของ </strong>
                    ${student_name} ${student_lastname} &nbsp;
                    รหัสนิสิต
                    ${student_code} &nbsp;
                  สาขา${depart_name}
                </span>
            </td>
        </tr>

        <tr>
            <td><span class="style3">&nbsp;</span></td>
        </tr>

        ${datesInfo && datesInfo.length > 0 ? `
        <tr>
            <td>
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr valign="top">
                   
                        <td width="90"><span class="style8"><strong> สิ่งที่ส่งมาด้วย </strong></span></td>
                        <td colspan="2"><span class="style8">แบบตอบรับ รายวิชาประสบการณ์ภาคสนาม ระหว่างวันที่ ${datesInfo} 
                        </span></td>
                    
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td><span class="style3">&nbsp;</span></td>
        </tr>
        <tr>
            <td>
                <span class="style8">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ด้วย ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร ได้เปิดการเรียนการสอนในรายวิชา 305291 ประสบการณ์ภาคสนาม 2 และ รายวิชา 305292 
                    ประสบการณ์ภาคสนาม 3  สำหรับนิสิตสาขาวิชาวิศวกรรมคอมพิวเตอร์ ชั้นปีที่ 2 (รหัส ${displayedStudentCode}) ประจำปีการศึกษา ${companyYear} โดยมี ดร.สุรเดช จิตประไพกุลศาล 
                    เป็นอาจารย์ประจำรายวิชา รายวิชาดังกล่าวจะเน้นให้นิสิตได้รับประสบการณ์นอกเหนือจากการเรียนการสอนเพื่อให้นิสิตพัฒนาความรู้ทางวิชาการและทักษะที่เกี่ยวข้องทางด้านวิศวกรรมคอมพิวเตอร์  
                    ซึ่งกำหนดระหว่างเวลาปฏิบัติงาน ณ สถานประกอบการจริง เริ่มฝึกงานในวันที่ ${datesInfo}  นั้น
                </span>
            </td>
        </tr>
        ` : ''}

        <tr>
            <td>
              <span class="style8">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    คณะวิศวกรรมศาสตร์ จึงใคร่ขอแจ้งสถานที่ฝึกงานของนิสิต ดังนี้
                </span>
            </td> 
        </tr>

        <tr>
          <td>
            <table cellpadding="0" cellspacing="0">
                <tr>
                  <td width="180">
                    <span class="style8">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${student_code}
                    </span>
                  </td>
                  <td>
                    <span class="style8">
                    ${student_name} ${student_lastname}
                    </span>
                  </td>
                </tr>
            </table>

            <table cellpadding="0" cellspacing="0">
                <tr>
                  <td width="180" style="vertical-align: top;">
                    <span class="style8">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <strong> สถานที่ฝึกงาน </strong>
                    </span>
                  </td>
                  <td style="vertical-align: top;">
                    <span class="style8">
                    ${company_name} ${company_building} มหาวิทยาลัยนเรศวร 
                    </span>
                  </td>
                </tr>
            </table>
          </td>
        </tr>

        <tr>
            <td><span class="style3">&nbsp;</span></td>
        </tr>
        <tr>
            <td>
                <span class="style8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    จึงเรียนมาเพื่อโปรดทราบ</span>
            </td>
        </tr>
        <tr>
            <td><span class="style3">&nbsp;</span></td>
        </tr>
        <tr>
            <td align="center"><span class="style8">ขอแสดงความนับถือ</span></td>
        </tr>
        <tr>
            <td height="75" align="center"><!--<img src="images/sitphank.png" width="223" height="76"/>--></td>
        </tr>
        <tr>
            <td align="center"><span class="style8">(นายภัคพงศ์ หอมเนียม)</span></td>
        </tr>
        <tr>
            <td align="center"><span class="style8">รองคณบดีฝ่ายกิจการนิสิต ปฏิบัติราชการแทน</span></td>
        </tr>
        <tr>
            <td align="center"><span class="style8">คณบดีคณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร</span></td>
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
            <td><span class="style3">งานกิจการนิสิตและศิษย์เก่าสัมพันธ์</span></td>
        </tr>
        <tr>
            <td><span class="style3">โทรศัพท์.055-964015/4017/4018</span></td>
        </tr>
        <tr>
            <td><span class="style3">โทรสาร.055-964000</span></td>
        </tr>
        <tr>
            <td><span class="style3">E-mail : training.eng.nu@gmail.com</span></td>
        </tr>
    </table>
    <tr>
      <td><span class="style3">&nbsp;</span></td>
    </tr>
    <tr>
        <td><span class="style3">&nbsp;</span></td>
    </tr>
</body>
</html>
`;

    const htmlsubmit = `
<!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=windows-874" />
    <title>หนังสือแจ้งผู้แจ้งผู้ปกครองเรื่องการฝึกงาน</title>
    <style type="text/css">
        <!--
        .style3 {
            font-family: "TH SarabunPSK";
            font-size: 14px;
        }

        .style8 {
            font-family: "TH SarabunPSK";
            font-size: 18px;
        }
        -->
    </style>
</head>

<body topmargin="top">
    <table width="620" border="0" align="center">
        <tr>
            <td><span class="style3">&nbsp;</span></td>
        </tr>
        <tr>
            <td>
                <div align="center"><img src="https://upload.wikimedia.org/wikipedia/th/1/1d/NU_ENG_2015_Logo.png" 
                width="79" height="79" /></div>
            </td>
        </tr>

        <tr>
        <td><span class="style3">&nbsp;</span></td>
        </tr>
        <tr align="center">
            <td><span class="style8"><strong>แบบตอบรับ รายวิชาประสบการณ์ภาคสนาม ระหว่างวันที่ ${datesInfo} </strong>
            </span></td>
        </tr>
        <tr align="center">
            <td><span class="style8">
            สำหรับนิสิตสาขาวิชาวิศวกรรมคอมพิวเตอร์  รหัส ${displayedStudentCode}  คณะวิศวกรรมศาสตร์
            </span></td>
        </tr>

        <tr>
            <td><span class="style6">&nbsp;</span></td>
        </tr>

        <tr>
            <td>
                <span class="style8"><strong> ข้อมูลผู้ปกครองนิสิต </strong> 
                <tr><td><span class="style8">&nbsp;</span></td></tr>
                <tr>
                  <td><span class="style8"> ข้าพเจ้า (นาย/นาง/นางสาว)..............................................................................................................................................................</span></td>
                </tr>
                <tr>
                  <td><span class="style8"> เบอร์โทรศัพท์(กรณีมีเหตุเร่งด่วน).......................................................................................................................................................</span></td>
                </tr>
                <tr>
                  <td><span class="style8">เป็นผู้ปกครองของนิสิต &nbsp;&nbsp;&nbsp;&nbsp;
                    ${student_name} ${student_lastname} &nbsp;&nbsp; รหัสนิสิต &nbsp; ${student_code}</span></td>
                </tr>
                <tr>
                  <td><span class="style8">เกี่ยวข้องเป็น...........................................................................&nbsp;</span></td>
                </tr>
                </span>
            </td>
        </tr>

        <tr>
            <td><span class="style3">&nbsp;</span></td>
        </tr>
        <tr>
            <td>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="checkbox" name="checkbox2"> <span class="style8"> &nbsp; อนุญาตให้นิสิตฝึกงานระหว่างวันที่ ${datesInfo} </span>
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="checkbox" name="checkbox3"> <span class="style8"> &nbsp; ไม่อนุญาตให้นิสิตฝึกงาน </span> 
            </td>
        </tr>
        
        <tr>
            <td>
                <span class="style8">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;เพราะ.......................................................................................................................
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
            <td align="center"><span class="style8">ลงชื่อ.................................................</span></td>
        </tr>
        <tr>
            <td align="center"><span class="style8">(.........................................................)</span></td>
        </tr>
        <tr>
            <td align="center"><span class="style8">วันที่...............เดือน..........................พ.ศ...........</span></td>
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
            <td><span class="style3">&nbsp;</span></td>
        </tr>
        <tr>
        <td><span class="style3">&nbsp;</span></td>
        </tr>
        <tr>
            <td align="center"><span class="style6">--------------------------------------------------------------------------------------------------------------------------------------------------------------</span></td>
        </tr>
        <tr>
            <td align="center"><span class="style6"><strong> กรุณส่งกลับ งานกิจการนิสิตและศิษย์เก่าสัมพันธ์ คณะวิศวกรรมศาสตร์ </strong></span></td>
        </tr>
        <tr>
            <td align="center"><span class="style6"><strong> ภายในวันที่  20 ตุลาคม  2566 </strong></span></td>
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
       
    </table>
</body>

</html>
`;
    return htmlContent + htmlsubmit;
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