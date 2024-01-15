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
  selector: 'app-thanks-form',
  templateUrl: './thanks-form.component.html',
  styleUrls: ['./thanks-form.component.css']
})
export class ThanksFormComponent {
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
      this.router.navigateByUrl('/login-officer', { replaceUrl: true });
      return;
    }
  }

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


  selectForm(company: Company) {
    if (company && company.company_id) {
      const students = this.student[company.company_id];
      const need_students = this.need_student[company.company_id];
      // console.log('Students:', students);
      // console.log('company:', company);
      // console.log('Need Students:', need_students);
      if (students && need_students && students.length > 0 && need_students.length > 0) {
        const fileContent = this.generateFileUrl(company, students, need_students);

        if (fileContent) {
          const newTab = window.open(fileContent, '_blank');

          if (newTab) {
            newTab.document.write(fileContent);
            newTab.document.close();
          } else {
            console.error('Unable to open new tab. Please check your popup settings.');
          }
        }
      } else {
        console.error('No student or need_student data found for the selected company.');
      }
    } else {
      this.router.navigate(['/search-permission-form-officer']);
    }
  }

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
<title>หนังสือขอบคุณหน่วยงาน</title>
<style type="text/css">
  <!--
    .style3 {
      font-family: "TH SarabunPSK"; 
      font-size:12px; 
    }

    .style8 {
      font-family: "TH SarabunPSK"; 
      font-size:16px; 
    }
  -->
</style>
</head>

<body topmargin="top">
  <table width="600" border="0" align="center">
    <tr>
      <td>
        <table width="100%" border="0" align="center">
          <tr>
            <td width="200" height="160">
              <p class="style8">ที่ อว. 0603.09/ว.01321</p>
              <p class="style8">&nbsp;</p>
            </td>
            <td valign="top" colspan="2">
            <div align="center"><img src="http://www.thailibrary.in.th/wp-content/uploads/2013/04/482457_10200601494981789_1825578775_n.jpg" width="79" height="83" /></div>
              <p>&nbsp;</p>
            </td>
            <td width="200"><p class="style3" align="right">&nbsp;เลขที่ ......................</p><p></p>
              <p class="style8">คณะวิศวกรรมศาสตร์<br />
                มหาวิทยาลัยนเรศวร<br />
                ตำบลท่าโพธิ์ อำเภอเมืองฯ<br />
                จังหวัดพิษณุโลก 65000 </p>          
            </td>
          </tr>
          <tr>
            <td height="28"><span class="style4"></span></td>
            <td width="100"><span class="style4"></span></td>
            <td colspan="2"><span class="style8"><?php echo LongThaiDate($docdate) ; ?>
              ${formattedDate} 
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
      <td><span class="style8">เรื่อง &nbsp;&nbsp;ขอขอบคุณ </span></td>
    </tr>
    <tr>
      <td><span class="style3">&nbsp;</span></td>
    </tr>

    <tr>
      <td>
        <span class="style8">เรียน <strong>&nbsp;&nbsp; 
        ${send_name}</strong><br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
        <strong> <? } ?>
              ${company_name}  
              ${company_building}</strong>
        </span>
      </td>
    </tr>

    <tr>
      <td><span class="style3">&nbsp;</span></td>
    </tr>

    <tr>
      <td>
        <table width="600" cellpadding="0" cellspacing="0">
          <tr>
              <td width="40"><span class="style8">อ้างถึง </span></td>
              <td colspan="2"><span class="style8"> หนังสือราชการคณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร ที่ อว.0603.09/ว.01648</span></td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td><span class="style3">&nbsp;</span></td>
    </tr>

    <!--
    <tr>
      <td><span class="style8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ด้วย คณะวิศวกรรมศาสตร์  มหาวิทยาลัยนเรศวร ได้กำหนดให้นิสิตระดับปริญญาตรี  ออกฝึกงานตามหลักสูตรภาคเรียนฤดูร้อน ประจำปีการศึกษา 2564  โดยเน้นให้นิสิตศึกษาหาความรู้  และประสบการณ์นอกเหนือจากการเรียนการสอน  ระหว่างวันที่ (8 สัปดาห์)</span></td>
    </tr>
    -->
    
    <tr>
      <td>
      ${datesInfo && datesInfo.length > 0 ? `
        <span class="style8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          ด้วยหลักสูตรวิศวกรรมศาสตรบัณฑิต ได้กำหนดให้นิสิตชั้นปีที่ 3 คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร   จำนวน 8 หลักสูตร ออกฝึกงานในภาคเรียนฤดูร้อน ประจำปีการศึกษา ${year} 
          โดยเริ่มฝึกงานตั้งแต่วันที่ ${datesInfo} และ ทางคณะฯ ได้รับความอนุเคราะห์จากหน่วยงานของท่านรับนิสิตสาขา${students[0].depart_name} จำนวน  ${ students.length }  ราย คือ  
        </span>
        ` : ''} 
      </td>
    </tr>

    <tr>
      <td>
        <table cellpadding="0" cellspacing="0">
          ${students.map(student => `
            <tr>
              <td width="300">
                <span class="style8">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  ${student.student_name} ${student.student_lastname}
                </span>
              </td>
              <td>
                <span class="style8">
                  รหัสประจำตัวนิสิต &nbsp; ${student.student_code}
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
        <span class="style8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          เข้าฝึกงานในช่วงระยะเวลาดังกล่าว นิสิตที่เข้าฝึกงานได้รับความรู้ประสบการณ์ในการปฎิบัติงานจริงและสามารถนำมาประยุกต์ใช้กับสาขาวิชาชีพที่ได้ศึกษา  
          รวมทั้งการต้อนรับจากหน่วยงานของท่านเป็นอย่างดียิ่ง                  
          คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวรจึงใคร่ขอขอบคุณในความอนุเคราะห์ของท่านและผู้เกี่ยวข้องเป็นอย่างยิ่งมา ณ โอกาสนี้
        </span>
      </td>
    </tr>

    <tr>
      <td><span class="style3">&nbsp;</span></td>
    </tr>
    <tr>
      <td><span class="style8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;จึงเรียนมาเพื่อโปรดทราบ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร หวังเป็นอย่างยิ่งว่าคงได้รับความอนุเคราะห์จากท่านด้วยดี</span></td>
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
      <td align="center"><span class="style8">รองคณบดีฝ่ายกิจการนิสิต  ปฏิบัติราชการแทน</span></td>
    </tr>
    <tr>
      <td align="center"><span class="style8">คณบดีคณะวิศวกรรมศาสตร์</span></td>
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
      <td><span class="style3">E-mail :  training.eng.nu@gmail.com</span></td>
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

