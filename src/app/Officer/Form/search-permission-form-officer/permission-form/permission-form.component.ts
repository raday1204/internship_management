import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CompanyStudentService } from 'src/app/Student/General/search-company-student/company-student/company-student.service';

interface NeedStudent {
  date_addtraining: string;
  date_endtraining: string;
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
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.css']
})
export class PermissionFormComponent {
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

//พิมพ์เอกสาร
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
            <title>หนังสือขอความอนุเคราะห์รับนิสิตเข้าฝึกงาน</title>
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


  //สร้างหน้า html เอกสาร
  generateFileUrl(company: Company, students: Student[], need_students: NeedStudent[]): string {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const { depart_name } = this.student;

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


    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-874" />
<title>หนังสือขอความอนุเคราะห์รับนิสิตเข้าฝึกงาน</title>
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
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span>
          </span></td>
        </tr>
        <tr>
          <td><span class="style8">
          <strong> ที่</strong><span style="border-bottom: 1px dotted #000;">&nbsp; &nbsp; อว 0603.09/ว.1861 
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span>
          <strong> วันที่ </strong><span style="border-bottom: 1px dotted #000;"> &nbsp; &nbsp; 17  กรกฎาคม  2566 
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  </span>
          </span></td>
        </tr>
        <tr>
          <td><span class="style8">
          <strong> เรื่อง </strong><span style="border-bottom: 1px dotted #000;"> &nbsp; &nbsp; ขอความอนุเคราะห์รับนิสิตเข้าฝึกงาน (เพิ่มเติม) 
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span> 
        </tr>

      <tr>
        <td><span class="style3">&nbsp;</span></td>
      </tr>
      <tr>
        <td>
          <span class="style8">
              <strong> เรียน &nbsp;&nbsp; ${send_name} มหาวิทยาลัยนเรศวร</strong><br/>
          </span>
        </td>
      </tr>

      <!--
      <tr>
        <td><span class="style3">&nbsp;</span></td>
      </tr>
      <tr>
        <td>
         <table width="600" cellpadding="0" cellspacing="0">
           <tr>
              <td width="90"><span class="style8">สิ่งที่ส่งมาด้วย </span></td>
              <td colspan="2"><input type="checkbox" name="checkbox1" checked/><span class="style8"> หนังสือตอบรับนิสิตเข้าฝึกงาน &nbsp; เลขที่ ..... </span></td>
            </tr>
            <tr>
              <td><span class="style8">&nbsp;</span></td>
              <td width="238"><input type="checkbox" name="checkbox2"> <span class="style8"> ประวัตินิสิต </span></td>
              <td width="255"><input type="checkbox" name="checkbox3"> <span class="style8"> ผลการเรียนนิสิต </span></td>
            </tr>
         </table>
         </td>
      </tr>
      -->

      <tr>
        <td><span class="style3">&nbsp;</span></td>
      </tr>

      <tr>
        <td>
        ${datesInfo && datesInfo.length > 0 ? `
          <span class="style8">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            ด้วย สาขาวิชาวิศวกรรมคอมพิวเตอร์ ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร ได้เปิดการเรียนการสอนในรายวิชา 305191 ประสบการณ์ภาคสนาม 1 
            และ รายวิชา 305291 ประสบการณ์ภาคสนาม 2  สำหรับนิสิตสาขาวิชาวิศวกรรมคอมพิวเตอร์ ชั้นปีที่ 2 (รหัส 65) ประจำปีการศึกษา ${year} โดยมี ดร.สุรเดช จิตประไพกุลศาล 
            เป็นอาจารย์ประจำรายวิชา รายวิชาดังกล่าวจะเน้นให้นิสิตได้รับประสบการณ์นอกเหนือจากการเรียนการสอนเพื่อให้นิสิตพัฒนาความรู้ทางวิชาการและทักษะที่เกี่ยวข้องทางด้านวิศวกรรมคอมพิวเตอร์  ซึ่งกำหนดระหว่างเวลาปฏิบัติงาน ณ สถานประกอบการจริง
            เริ่มฝึกงานในวันที่ ${datesInfo}   
          </span>
        ` : ''}
        </td>
      </tr>

      <tr>
        <td>
          <span class="style8">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร เห็นว่าหน่วยงานของท่านมีความเหมาะสมที่จะให้ความรู้และประสบการณ์ตรงกับนิสิตได้เป็นอย่างดี จึงขอความอนุเคราะห์รับนิสิตสาขาวิชาวิศวกรรมคอมพิวเตอร์ 
            จำนวน ${ students.length } ราย ตามรายชื่อข้างท้ายนี้ เข้าฝึกงานในหน่วยงาน ของท่าน
          </span>
        </td>
      </tr>

      
      <tr>
          <td>
            <table cellpadding="0" cellspacing="0">
            ${students.map((student, index) => `
                <tr>
                  <td width="180">
                    <span class="style8">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            ทั้งนี้ คณะวิศวกรรมศาสตร์  จึงใคร่ขอความอนุเคราะห์ท่านแจ้งผลการตอบรับในแบบฟอร์มตอบรับนิสิตเข้าฝึกงานให้คณะฯ ทราบด้วยโดยทางโทรสารฯ 
            จดหมายอีเมล์ : training.eng.nu@gmail.com ภายในวันที่ 1 กันยายน 2566
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
              จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์   คณะวิศวกรรมศาสตร์  มหาวิทยาลัยนเรศวร หวังเป็นอย่างยิ่งว่าคงได้รับความอนุเคราะห์จากท่านด้วยดี
            </span>
          </td>
        </tr>

        <!--
        <tr>
            <td><span class="style3">&nbsp;</span></td>
        </tr>
        <tr>
            <td align="center"><span class="style8">ขอแสดงความนับถือ</span></td>
        </tr>
        -->

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

        <!--
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
        -->
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