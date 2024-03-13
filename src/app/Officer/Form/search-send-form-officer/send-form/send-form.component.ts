import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CompanyStudentService } from 'src/app/Student/General/search-company-student/company-student/company-student.service';

interface NeedStudent {
  date_addtraining: string;
  date_endtraining: string;
  number_student_train: string;
}

interface Company {
  selected: boolean;
  year: string;
  company_id: string;
  company_name: string;
  company_building: string;
  send_name: string;
  date_addtraining: string;
  date_endtraining: string;
}

interface Student {
  student_code: string;
  student_name: string;
  student_lastname: string;
  student_mobile: string;
  depart_code: string;
  depart_name: string;
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
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.css']
})
export class SendFormComponent {
  companyInformation: CompanyInformation[] = [];
  student: { [key: string]: Student[] } = {};
  need_student: { [key: string]: NeedStudent[] } = {};
  selectedOption1: string | undefined;
  selectedOption2: string | undefined;
  username: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private companyStudentService: CompanyStudentService
  ) { }

  ngOnInit(): void {
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

  //ดึงข้อมูลนิสิตในปีการศึกษาและประเภทที่เลือก
  fetchData() {
    if (this.selectedOption1 && this.selectedOption2) {
      this.http.get<CompanyResponse>(`http://localhost/PJ/Backend/Officer/Company/get-company-information.php?year=${this.selectedOption1}&type_name=${this.selectedOption2}`)
        .subscribe(
          (response: CompanyResponse) => {
            // console.log('Backend Response:', response);

            if (response && response.success) {
              if (Array.isArray(response.data)) {
                this.companyInformation = response.data.filter(companyInfo => {
                  // Filter out companies without students
                  return companyInfo.students && companyInfo.students.length > 0;
                });

                // Build the student and need_student maps for filtered companies
                this.companyInformation.forEach(company => {
                  this.student[company.company.company_id] = company.students;
                  this.need_student[company.company.company_id] = company.need_students;
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
              <title>หนังสือแจ้งรายชื่อนิสิตเข้าฝึกงาน</title>
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
          const company = companyInfo.company;
          const students = companyInfo.students;
          const need_students = companyInfo.need_students;
          const htmlContent = this.generateFileUrl(company, students, need_students);
          newTab.document.body.innerHTML += htmlContent;
        });

        newTab.document.write('</body></html>');
      } else {
        console.error('Unable to open new tab.');
      }
    }
  }

  //สร้าง html เพื่อพิมพ์เอกสาร
  generateFileUrl(company: Company, students: Student[], need_students: NeedStudent[]): string {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const studentNames = students.map(student => `${student.student_name} ${student.student_lastname}`).join(', ');

    const { company_name, company_building, send_name, year } = company;
    // const { date_addtraining, date_endtraining} = need_student;
    const datesInfo = need_students && need_students.length > 0
      ? need_students.map(need_student => {
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

    const firstStartDate = need_students && need_students.length > 0
      ? new Date(need_students[0].date_addtraining).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      : '';

    const number_student_train = need_students && need_students.length > 0
      ? need_students[0].number_student_train
      : '';

    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=windows-874" />
    <title>หนังสือแจ้งรายชื่อนิสิตเข้าฝึกงาน</title>
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

    <body topmargin="top">
      <table width="620" border="0" align="center">
        <tr>
          <td>
            <table width="100%" border="0" align="center">
              <tr>
                <td width="200" valign="top">
                  <div align="left"><img src="http://www.thailibrary.in.th/wp-content/uploads/2013/04/482457_10200601494981789_1825578775_n.jpg" width="79" height="83" /></div>
                </td>
                <td height="83" colspan="2" valign="bottom">
                    <p class="style8" align="center"><strong> บันทึกข้อความ </strong></p>         
                </td>
                <td width="200" height="83"></td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td><span class="style8">
          <strong> ส่วนราชการ </strong><span style="border-bottom: 1px dotted #000;"> &nbsp; &nbsp; งานกิจการนิสิตและศิษย์เก่าสัมพันธ์  คณะวิศวกรรมศาสตร์ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span> 
          <strong> โทร. </strong><span style="border-bottom: 1px dotted #000;"> &nbsp; &nbsp; 4015 
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>
          </span></td>
        </tr>
        <tr>
          <td><span class="style8">
          <strong> ที่</strong><span style="border-bottom: 1px dotted #000;">&nbsp; &nbsp; อว 0603.09/ว.02681 
              &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>
          <strong> วันที่ </strong><span style="border-bottom: 1px dotted #000;"> &nbsp; &nbsp; 2  ตุลาคม  2566 
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>
          </span></td>
        </tr>
        <tr>
          <td><span class="style8">
          <strong> เรื่อง </strong><span style="border-bottom: 1px dotted #000;"> &nbsp; &nbsp; ขอขอบคุณและขอแจ้งรายชื่อนิสิตที่เข้าฝึกงานในหน่วยงานของท่าน 
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span> 
        </tr>

        <tr>
          <td><span class="style3">&nbsp;</span></td>
        </tr>

        <tr>
          <td>
            <span class="style8">
              <strong> เรียน &nbsp;&nbsp; 
              ${send_name}</strong>
            </span>
          </td>
        </tr>

        <tr>
          <td><span class="style3">&nbsp;</span></td>
        </tr>
        
        <tr>
          <td>
          ${datesInfo && datesInfo.length > 0 ? `
            <span class="style8">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              อ้างถึงบันทึกข้อความ อว 0603.09/ว.1861  จากงานกิจการนิสิตและศิษย์เก่าสัมพันธ์  คณะวิศวกรรมศาสตร์  
              ลงวันที่ 17 กรกฎาคม 2566  เรื่อง ขอความอนุเคราะห์รับนิสิตสาขาวิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ 
              เข้าฝึกงานในวันที่ ${datesInfo}  ตามความทราบแล้วนั้น  
            </span>
          ` : ''} 
          </td>
        </tr>

        <tr>
          <td>
            <span class="style8">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              ทางหน่วยงานของท่าน ได้ให้ความอนุเคราะห์รับนิสิตเข้าฝึกงาน จำนวน ${number_student_train} คน  เพื่อให้นิสิตได้รับความรู้ประสบการณ์ในการปฎิบัติงานจริงและสามารถนำมาประยุกต์ใช้กับสาขาวิชาชีพที่ได้ศึกษา  
              งานกิจการนิสิตและศิษย์เก่าสัมพันธ์ จึงใคร่ขอส่งรายชื่อนิสิตที่เข้าฝึกงาน จำนวน ${students.length} คน ดังนี้  
            </span> 
          </td>
        </tr>

        <tr>
          <td>
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
            <table cellpadding="0" cellspacing="0">
              ${students.map((student, index) => `
                <tr>
                  <td width="220">
                    <span class="style8">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${index + 1}. ${student.student_code}
                    </span>
                  </td>
                  <td>
                    <span class="style8">
                      ${student.student_name} ${student.student_lastname}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </table>
          </td>
        </tr>

        <tr>
          <td><span class="style8">&nbsp; </span></td>
        </tr> 
        <tr>
          <td>
            <span class="style8">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              งานกิจการนิสิตและศิษย์เก่าสัมพันธ์ คณะวิศวกรรมศาสตร์ จึงใคร่ขอขอบคุณในความอนุเคราะห์ของท่านเป็นอย่างยิ่งมา ณ โอกาสนี้
            </span>
          </td>
        </tr>

        <tr>
          <td><span class="style3">&nbsp;</span></td>
        </tr>
        <tr>
          <td>
            <span class="style8">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              จึงเรียนมาเพื่อโปรดทราบ และหวังเป็นอย่างยิ่งว่าคงได้รับความอนุเคราะห์จากท่านด้วยดี
            </span>
          </td>
        </tr>

        <tr>
          <td><span class="style3">&nbsp;</span></td>
        </tr>
        
        <tr>
        <td height="60" align="center"><!--<img src="images/sitphank.png" width="223" height="76"/>--></td>
        </tr>
        <tr>
          <td align="center"><span class="style8">(นายภัคพงศ์   หอมเนียม)</span></td>
        </tr>
        <tr>
          <td align="center"><span class="style8">รองคณบดีฝ่ายกิจการนิสิตและสารสนเทศ  ปฏิบัติราชการแทน</span></td>
        </tr>
        <tr>
          <td align="center"><span class="style8">คณบดีคณะวิศวกรรมศาสตร์</span></td>
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