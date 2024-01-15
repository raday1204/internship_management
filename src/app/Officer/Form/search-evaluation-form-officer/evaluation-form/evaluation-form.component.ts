import { Component } from '@angular/core';
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
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.css']
})
export class EvaluationFormComponent {
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
    private router: Router,
    private http: HttpClient,
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
//ปรับ
  selectForm(company: Company): void {
    // Assuming your PDF file is located at a specific URL
    const pdfUrl = "/assets/pdfs/แบบประเมินผลนิสิตฝึกงาน.pdf";
  
    // Open a new tab with the PDF file
    const newTab = window.open(pdfUrl, '_blank');
  
    if (newTab) {
      newTab.focus();
    } else {
      // Handle the case where the new tab was blocked by the browser's popup blocker
      console.error('Popup blocked. Please allow popups for this site.');
    }
  }
  
  

//   generateFileUrl(student: Student, company: Company, needStudents: NeedStudent[]): string {
//     const currentDate = new Date();
//     const formattedDate = currentDate.toLocaleDateString('th-TH', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });

//     const { student_name, student_lastname, student_code, depart_name, year: studentYear } = student;
//     const displayedStudentCode = student.student_code.slice(0, 2);
//     console.log('Student Year:', studentYear);

//     const { year: companyYear, send_name } = company;

//     const datesInfo = needStudents && needStudents.length > 0
//       ? needStudents.map(need_student => {
//         const startDate = new Date(need_student.date_addtraining);
//         const endDate = new Date(need_student.date_endtraining);

//         const formattedStartDate = startDate.toLocaleDateString('th-TH', {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric',
//         });

//         const formattedEndDate = endDate.toLocaleDateString('th-TH', {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric',
//         });
//         return ${formattedStartDate} ถึงวันที่ ${formattedEndDate};
//       }).join(', ')
//       : '';

//       const firstStartDate = needStudents && needStudents.length > 0
//     ? new Date(needStudents[0].date_addtraining).toLocaleDateString('th-TH', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     })
//     : '';
//     return `

// <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
// <html xmlns="http://www.w3.org/1999/xhtml">
// <head>
// <meta http-equiv="Content-Type" content="text/html; charset=windows-874" />
// <title>หนังสือขอส่งนิสิตเข้าฝึกงาน</title>
// <style type="text/css">
//   <!--
//     .style3 {
//       font-family: "TH SarabunPSK"; 
//       font-size:14px; 
//     }

//     .style8 {
//       font-family: "TH SarabunPSK";
//       font-size:18px; 
//     }
//   -->
// </style>
// </head>

// <body topmargin="top">
//   <table width="600" border="0" align="center">
//     <tr>
//       <td>
//         <table width="100%" border="0" align="center">
//           <tr>
//             <td width="200" height="160">
//               <p class="style8">ที่ อว 0603.09/ว.0239</p>
//               <p class="style8">&nbsp;</p>
//             </td>
//             <td valign="top" colspan="2">
//               <div align="center"><img src="http://www.thailibrary.in.th/wp-content/uploads/2013/04/482457_10200601494981789_1825578775_n.jpg" width="79" height="83" /></div>
//               <p>&nbsp;</p>
//             </td>
//             <td width="200"><p class="style3" align="right">&nbsp;เลขที่ ......................</p><p></p>
//               <p class="style8">คณะวิศวกรรมศาสตร์<br />
//                 มหาวิทยาลัยนเรศวร<br />
//                 ตำบลท่าโพธิ์ อำเภอเมืองฯ<br />
//                 จังหวัดพิษณุโลก 65000 </p>          
//             </td>
//           </tr>
//           <tr>
//             <td height="28"><span class="style4"></span></td>
//             <td width="100"><span class="style4"></span></td>
//             <td colspan="2"><span class="style8"><?php echo LongThaiDate($docdate) ; ?>
//               ${formattedDate} 
//               </span>
//             </td>
//           </tr>
//         </table>
//       </td>
//     </tr>

//     <tr>
//       <td><span class="style3">&nbsp;</span></td>
//     </tr>
//     <tr>
//       <td><span class="style8"><strong>เรื่อง</strong> &nbsp;&nbsp;ขอส่งนิสิตคณะวิศวกรรมศาสตร์ เข้าฝึกงาน </span></td>
//     </tr>
//     <tr>
//       <td><span class="style3">&nbsp;</span></td>
//     </tr>
    
//     <tr>
//       <td>
//         <span class="style8"><strong>เรียน &nbsp;&nbsp; ${send_name} </strong></span>
//       </td>
//     </tr>

//     <tr>
//       <td><span class="style8">
//         <strong>สิ่งที่ส่งมาด้วย</strong> &nbsp;&nbsp; แบบประเมินนิสิตฝึกงาน คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร </span>
//       </td>
//     </tr>
    
//     <tr>
//       <td><span class="style3">&nbsp;</span></td>
//     </tr>
    
//     <tr>
//       <td>
//         ${datesInfo && datesInfo.length > 0 ? `
//           <span class="style8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//             ด้วยหลักสูตรวิศวกรรมศาสตรบัณฑิต ได้กำหนดให้นิสิตชั้นปีที่ 3 คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร   จำนวน 8 หลักสูตร ออกฝึกงานในภาคเรียนฤดูร้อน ประจำปีการศึกษา ${companyYear}   
//             เพื่อส่งเสริมให้นิสิตมีการเสริมสร้างประสบการณ์นอกเหนือจากการเรียนการสอน โดยเริ่มฝึกงานตั้งแต่วันที่ ${datesInfo} 
//           ` : ''} 
          
//             และทางคณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร ได้รับความอนุเคราะห์จากสถานประกอบการของท่านตอบรับนิสิตชั้นปีที่ 3    เข้าฝึกงาน ดังนี้  <br /><br />
//           </span>
//       </td>
//     </tr>

//     <tr>
//       <td>
//         <table cellpadding="0" cellspacing="0">
//             <tr>
//               <td width="250">
//                 <span class="style8">
//                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                   ${student_name} ${student_lastname}
//                 </span>
//               </td>
//               <td>
//                 <span class="style8">
//                   รหัสประจำตัวนิสิต &nbsp; ${student_code} &nbsp; &nbsp; &nbsp;
//                 </span>
//               </td>
//               <td>
//                 <span class="style8">
//                 สาขาวิชา${depart_name} 
//                 </span>
//               </td>
//             </tr>
//         </table>
//       </td>
//     </tr>

//     <tr>
//       <td>&nbsp;</td>
//     </tr>

//     <tr>
//       <td>
//       ${datesInfo && datesInfo.length > 0 ? `
//         <span class="style8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//         นิสิตจะเข้ารายงานตัวในวันที่ ${ firstStartDate }  และเข้าฝึกงานตั้งแต่วันที่ ${datesInfo} อนึ่ง คณะวิศวกรรมศาสตร์ 
//         ใคร่ขอความอนุเคราะห์จากท่านประเมินการฝึกงานของนิสิตตามแบบประเมินที่ลงนามโดยวิศวกรพี่เลี้ยงหลังจากนิสิตฝึกงานสิ้นสุดลงแล้ว 
//         และกรุณาส่งแบบประมินผลกลับคืนมายังคณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร ภายในวันที่ 15 มิถุนายน 2566 จักเป็นพระคุณยิ่ง</span></td>
//         ` : ''}     
//     </tr>

//     <tr>
//       <td>&nbsp;</td>
//     </tr>
  

//     <tr>
//       <td><span class="style8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;จึงเรียนมาเพื่อโปรดพิจารณา คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร หวังเป็นอย่างยิ่งว่าคงได้รับความอนุเคราะห์จากท่านด้วยดี</span></td>
//     </tr>
//     <tr>
//       <td>&nbsp;</td>
//     </tr>
//     <tr>
//       <td align="center"><span class="style8">ขอแสดงความนับถือ</span></td>
//     </tr>
//     <tr>
//       <td height="75" align="center"><!--<img src="images/sitphank.png" width="223" height="76"/>--></td>
//     </tr>
//     <tr>
//       <td align="center"><span class="style8">(นายภัคพงศ์ หอมเนียม)</span></td>
//     </tr>
//     <tr>
//       <td align="center"><span class="style8">รองคณบดีฝ่ายกิจการนิสิต  ปฏิบัติราชการแทน</span></td>
//     </tr>
//     <tr>
//       <td align="center"><span class="style8">คณบดีคณะวิศวกรรมศาสตร์</span></td>
//     </tr>
//     <tr>
//       <td>
//       </td>
//     </tr>
//     <tr>
//       <td>
//       <table width="100%" border="0">
//         <tr valign="bottom">
//           <td>
//             <table>
//                 <tr>
//       <td><span class="style3">งานกิจการนิสิตและศิษย์เก่าสัมพันธ์</span></td>
//     </tr>
//     <tr>
//       <td><span class="style3">โทรศัพท์.055-964015/4017/4018</span></td>
//     </tr>
//     <tr>
//       <td><span class="style3">โทรสาร.055-964000</span></td>
//     </tr>
//     <tr>
//       <td><span class="style3">E-mail :  training.eng.nu@gmail.com</span></td>
//     </tr>
//               </table>
//           </td>
//           <td>&nbsp;</td>
//           <td align="right"><br />
//       <span class="style3"></span></td>
//         </tr>
//       </table>    
//       </td>
//     </tr>
      
//   </table>
// </body>
// </html>
//     `;
//   }

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