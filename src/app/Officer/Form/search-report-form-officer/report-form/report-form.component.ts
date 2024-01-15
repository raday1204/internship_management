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
}

interface Student {
  year: string;
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
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent {
  companyInformation: CompanyInformation[] = [];
  student: { [key: string]: Student[] } = {};
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
    this.route.queryParams.subscribe(params => {
      this.selectedOption1 = params['year'];
      this.selectedOption2 = params['type_name'];
    });
    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);
    this.fetchData();

    // if (!this.username) {
    //   this.router.navigateByUrl('/login-officer', { replaceUrl: true });
    //   return;
    // }
  }

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

  selectForm(studentCode: string) {
    // Assuming that you have fetched the data and stored it in the 'companyInformation' array
    const studentCompanyIds = Object.keys(this.student);

    // Iterate through the companies with students
    for (const companyId of studentCompanyIds) {
      const studentsInCompany = this.student[companyId];
      const needStudentsInCompany = this.need_student[companyId];

      // Find the student with the given student_code in the current company
      const selectedStudent = studentsInCompany.find(student => student.student_code === studentCode);

      if (selectedStudent) {
        // Found the student, now get the corresponding company and need_student
        const company = this.company[companyId];
        const needStudentsForCompany = needStudentsInCompany;

        if (company && needStudentsForCompany) {
          const fileContent = this.generateFileUrl(selectedStudent, company, needStudentsForCompany);

          if (fileContent) {
            // Open the file URL in a new tab
            const newTab = window.open(fileContent, '_blank');

            if (newTab) {
              newTab.document.write(fileContent);
              newTab.document.close();

              // Log the 'year' property in the console
              console.log('Student Year:', selectedStudent.year);

              // Alternatively, you can display the 'year' in the student table as needed
              // For example, assuming you have a variable to store the 'year' in your component
              // this.displayedYear = selectedStudent.year;
            } else {
              console.error('Unable to open new tab. Please check your popup settings.');
            }
          }
        } else {
          console.error('Company or need_student not found for the selected student. companyId:', companyId);
          console.log('Available company IDs:', Object.keys(this.company));
        }

        // Exit the loop since we found the student
        return;
      }
    }

    // If no student is found, log an error or handle it as needed
    console.error('Student with student_code not found. studentCode:', studentCode);
  }

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

    const { year: companyYear, send_name, company_name, company_building } = company;

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

      const firstStartDate = needStudents && needStudents.length > 0
    ? new Date(needStudents[0].date_addtraining).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : '';

    const lastDate = needStudents && needStudents.length > 0
    ? new Date(needStudents[0].date_endtraining).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : '';
    return `

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-874" />
<title>หนังสือขอส่งนิสิตเข้าฝึกงาน</title>
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
  <table width="600" border="0" align="center">
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
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span>
      </span></td>
    </tr>
    <tr>
      <td><span class="style8">
      <strong> ที่</strong><span style="border-bottom: 1px dotted #000;">&nbsp; &nbsp; อว 0603.09/ว.02851 
          &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>
      <strong> วันที่ </strong><span style="border-bottom: 1px dotted #000;"> &nbsp; &nbsp; 17  ตุลาคม  2566  
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span>
      </span></td>
    </tr>
    <tr>
      <td><span class="style8">
      <strong> เรื่อง </strong><span style="border-bottom: 1px dotted #000;"> &nbsp; &nbsp; ขอส่งนิสิตคณะวิศวกรรมศาสตร์ เข้าฝึกงานในหน่วยงานของท่าน 
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span> 
    </tr>

    <tr>
      <td><span class="style3">&nbsp;</span></td>
    </tr>
    
    <tr>
      <td>
        <span class="style8"><strong>เรียน &nbsp;&nbsp; ${send_name} </strong></span>
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
            ด้วย คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร ได้เปิดการเรียนการสอนในรายวิชา 305191 ประสบการณ์ภาคสนาม 1 และ รายวิชา 305291 ประสบการณ์ภาคสนาม 2  
            สำหรับนิสิตสาขาวิชาวิศวกรรมคอมพิวเตอร์ ชั้นปีที่ 2 (รหัส ${displayedStudentCode}) ประจำปีการศึกษา ${companyYear} โดยมี ดร.สุรเดช จิตประไพกุลศาล เป็นอาจารย์ประจำรายวิชา 
            รายวิชาดังกล่าวจะเน้นให้นิสิตได้รับประสบการณ์นอกเหนือจากการเรียนการสอนเพื่อให้นิสิตพัฒนาความรู้ทางวิชาการและทักษะที่เกี่ยวข้องทางด้านวิศวกรรมคอมพิวเตอร์  
            ซึ่งกำหนดระหว่างเวลาปฏิบัติงาน ณ สถานประกอบการจริง เริ่มฝึกงานในเข้าฝึกงานในวันที่ ${datesInfo}  และทางคณะฯ 
            ได้รับความอนุเคราะห์จากหน่วยงานของท่านตอบรับนิสิตเข้าฝึกงาน ดังนี้  
          </span>
        ` : ''}
      </td>
    </tr>

    <tr>
      <td>
        <table cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span class="style8" style="vertical-align: top;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <strong> สถานที่ฝึกงาน </strong> &nbsp;&nbsp;&nbsp;
                ${company_name} ${company_building}
                </span>
              </td>
            </tr>
        </table>

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
      </td>
    </tr>

    <tr>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td>
      ${datesInfo && datesInfo.length > 0 ? `
        <span class="style8">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          นิสิตจะเข้ารายงานตัวในวันที่  ${ firstStartDate }  อนึ่ง คณะวิศวกรรมศาสตร์ ใคร่ขอความอนุเคราะห์จากท่านประเมินการฝึกงานของนิสิต 
          ภายหลังจากนิสิตฝึกงานสิ้นสุดลงแล้ว  และกรุณาส่งแบบประเมินผลกลับคืนมายัง งานกิจการนิสิตและศิษย์เก่าสัมพันธ์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร 
          ภายในวันที่ ${ lastDate } จักเป็นพระคุณยิ่ง</span></td>
      ` : ''}     
    </tr>

    <tr>
      <td>&nbsp;</td>
    </tr>
  

    <tr>
      <td><span class="style8">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        จึงเรียนมาเพื่อโปรดทราบ และหวังเป็นอย่างยิ่งว่าคงได้รับความอนุเคราะห์จากท่านด้วยดี </span></td>
    </tr>
    <tr>
      <td>&nbsp;</td>
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
      <td>
      </td>
    </tr>

    <!--
    <tr>
      <td>
      <table width="100%" border="0">
        <tr valign="bottom">
          <td>
            <table>
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
          </td>
          <td>&nbsp;</td>
          <td align="right"><br />
      <span class="style3"></span></td>
        </tr>
      </table>    
      </td>
    </tr>
    -->
      
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