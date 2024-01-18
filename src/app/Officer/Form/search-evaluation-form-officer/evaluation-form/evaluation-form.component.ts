import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CompanyStudentService } from 'src/app/Student/General/search-company-student/company-student/company-student.service';

interface Company {
  selected: boolean;
  year: string;
  company_id: string;
  company_name: string;
  company_building: string;
}

interface CompanyInformation {
  company: Company;
  companyName: string;
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
  selectedOption2: string | undefined;
  username: string = '';
  companyNames: { [companyId: string]: Company } = {};
  currentCompanyId: string = '';
  currentDate: Date = new Date();
  currentPage = 1;
  itemsPerPage = 20;
  totalItems = 0;
  displayedCompanyInformation: any[] = [];
  companyName: any;
  selectedCompanyNames: string[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private companyStudentService: CompanyStudentService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedOption2 = params['type_name'];
    });
    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);
    this.fetchCompanyData();

    if (!this.username) {
      this.router.navigateByUrl('/login-officer', { replaceUrl: true });
      return;
    }
  }

  // display company data based on the selected type_name
  fetchCompanyData() {
    if (this.selectedOption2) {
      this.http.get<CompanyResponse>(`http://localhost/PJ/Backend/Officer/Company/get-company-typename.php?type_name=${this.selectedOption2}`)
        .subscribe(
          (response: CompanyResponse) => {
            if (response.success && Array.isArray(response.data)) {
              this.companyInformation = response.data;
              console.log('Company Data:', this.companyInformation);

              this.loadCompanyInformation();
              this.totalItems = this.companyInformation.length;

              // Store selected company names
              this.selectedCompanyNames = this.companyInformation.map(info => info.companyName);
              // this.selectForm(this.selectedCompanyNames);
            } else {
              console.error('Invalid data structure in the server response.');
            }
          },
          (error) => {
            console.error('HTTP Error:', error);
          }
        );
    } else {
      console.error('Invalid selectedOption2 value.');
    }
  }

  //กำหนด perpage
  loadCompanyInformation(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.displayedCompanyInformation = this.companyInformation.slice(startIndex, endIndex);
  }

  paginate(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.loadCompanyInformation();
  }

  //เลือกพิมพ์เอกสารทุกหน่วยงาน
  onPrintButtonClick(): void {
    if (this.selectedCompanyNames) {
      this.selectForm(this.selectedCompanyNames);
    } else {
      console.error('Selected company names are undefined.');
    }
  }

  //เลือกพิมพ์เอกสารเฉพาะหน่วยงาน
  selectForm(selectedCompanyNames: string[] | undefined): void {
    if (selectedCompanyNames && selectedCompanyNames.length > 0) {
      const newTab = window.open('', '_blank');
      if (newTab) {
        newTab.document.write(`
          <html>
            <head>
              <title>หนังสือขอความอนุเคราะห์รับนิสิตเข้าฝึกงาน</title>
              <meta http-equiv="Content-Type" content="text/html; charset=windows-874" />
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

        // Loop through each company name and add its specific content
        selectedCompanyNames.forEach(companyName => {
          const htmlContent = `
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
                    <strong> เรื่อง </strong><span style="border-bottom: 1px dotted #000;"> &nbsp; &nbsp; ขอความอนุเคราะห์รับนิสิตเข้าฝึกงาน  
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span> 
                  </tr>
          
                <tr>
                  <td><span class="style3">&nbsp;</span></td>
                </tr>
                <tr>
                  <td>
                    <span class="style8">
                        <strong> เรียน &nbsp;&nbsp; ${companyName} </strong><br/>
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
                    <span class="style8">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      ด้วย สาขาวิชาวิศวกรรมคอมพิวเตอร์ ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร ได้เปิดการเรียนการสอนในรายวิชา 305191 ประสบการณ์ภาคสนาม 1 
                      และ รายวิชา 305291 ประสบการณ์ภาคสนาม 2  สำหรับนิสิตสาขาวิชาวิศวกรรมคอมพิวเตอร์ ชั้นปีที่ 2 (รหัส 65) ประจำปีการศึกษา 2566 โดยมี ดร.สุรเดช จิตประไพกุลศาล 
                      เป็นอาจารย์ประจำรายวิชา รายวิชาดังกล่าวจะเน้นให้นิสิตได้รับประสบการณ์นอกเหนือจากการเรียนการสอนซึ่งได้กำหนดระหว่างเวลาปฏิบัติงานจริง เริ่มฝึกงานในวันที่ 1-17 พฤศจิกายน 2566  
                    </span>
                  </td>
                </tr>
          
                <tr>
                  <td>
                    <span class="style8">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร เห็นว่าหน่วยงานของท่านมีความเหมาะสมที่จะให้ความรู้และประสบการณ์ตรงกับนิสิตได้เป็นอย่างดี จึงขอความอนุเคราะห์รับนิสิตสาขาวิชาวิศวกรรมคอมพิวเตอร์ชั้นปีที่ 2 (รหัส 65) 
                      เข้าฝึกงาน โดยระบุจำนวนความต้องการของหน่วยงาน  และลักษณะงานที่มอบหมายให้กับนิสิต เช่น ปฏิบัติงานหน่วยงานธุรการ ระบบงานด้านเอกสาร, ปฏิบัติงานกับภาควิชาฯ ตามแต่ที่ภาควิชามอบหมาย, 
                      งานระบบคอมพิวเตอร์เบื้องต้น  เป็นต้น  เพื่อเป็นการเรียนรู้กระบวนการทำงานขององค์กร   
                    </span>
                  </td>
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
                        จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์   คณะวิศวกรรมศาสตร์  หวังเป็นอย่างยิ่งว่าคงได้รับความอนุเคราะห์จากท่านด้วยดี
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
                      <td><span class="style3">&nbsp;</span></td>
                  </tr>
                  <tr>
                      <td><span class="style3">&nbsp;</span></td>
                  </tr>
                  <tr>
                      <td><span class="style3">&nbsp;</span></td>
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
          
          </table>
          </body>
          </html>
          `;

          newTab.document.write(htmlContent);
        });
        selectedCompanyNames.forEach(companyName => {
          const htmlSubmit = `
        <!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=windows-874" />
            <title>แบบสำรวจความต้องการรรับนิสิตเข้าฝึกงาน</title>
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
                      <div width="620" align="center"><img src="http://www.eng.nu.ac.th/eng2012/docs/logo/2015_bw.jpg" 
                      width="79" height="79" /></div>
                  </td>
                </tr>
        
                <tr>
                <td><span class="style3">&nbsp;</span></td>
                </tr>
                <tr align="center">
                    <td><span class="style8"><strong> แบบสำรวจความต้องการรับนิสิตเข้าฝึกงาน <br />
                        สำหรับนิสิตสาขาวิชาวิศวกรรมคอมพิวเตอร์ ชั้นปีที่ 2 (รหัส 65) </strong>
                    </span></td>
                </tr>

                <tr align="center">
                    <td><span class="style3"> เริ่มฝึกงานในวันที่ 21 กรกฎาคม 2566 ถึงวันที่ 27 ตุลาคม 2566 <br />
                        (ฝึกงานเฉพาะวันศุกร์เวลา 09.00-12.00 น.)
                    </span></td>
                </tr>

                <tr>
                    <td><span class="style6">&nbsp;</span></td>
                </tr>
                <tr>
                    <td><span class="style8">
                        <strong> ${companyName} มหาวิทยาลัยนเรศววร </strong>
                    </span></td>
                </tr>

                <tr>
                <td>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="checkbox" name="checkbox2"> <span class="style8"> &nbsp;&nbsp; ไม่มีความประสงค์รับนิสิตเข้าฝึกงาน  </span>
                </td>
            </tr>
            <tr>
                <td>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="checkbox" name="checkbox3"> <span class="style8"> &nbsp;&nbsp; มีความประสงค์รับนิสิตเข้าฝึกงาน  รวมจำนวน.......................คน </span> 
                </td>
            </tr>

                <tr>
                    <td><span class="style6">&nbsp;</span></td>
                </tr>
        
                <tr>
                    <td>
                        <span class="style8"><strong> หน่วยงานภายในคณะฯ ที่รับนิสิตเข้าฝึกงาน </strong> 
                        <tr>
                          <td><span class="style8"> 1) ชื่อหน่วยงาน.....................................................................................................................................
                              จำนวนที่รับ.......................คน
                              </span>
                          </td>
                        </tr>
                        <tr>
                          <td><span class="style8"> &nbsp;&nbsp;&nbsp; ลักษณะงาน.......................................................................................................................................................................................</span></td>
                        </tr>

                        <tr>
                          <td><span class="style8"> 2) ชื่อหน่วยงาน.....................................................................................................................................
                              จำนวนที่รับ.......................คน
                              </span>
                          </td>
                        </tr>
                        <tr>
                          <td><span class="style8"> &nbsp;&nbsp;&nbsp; ลักษณะงาน.......................................................................................................................................................................................</span></td>
                        </tr>

                        <tr>
                          <td><span class="style8"> 3) ชื่อหน่วยงาน.....................................................................................................................................
                              จำนวนที่รับ.......................คน
                              </span>
                          </td>
                        </tr>
                        <tr>
                          <td><span class="style8"> &nbsp;&nbsp;&nbsp; ลักษณะงาน.......................................................................................................................................................................................</span></td>
                        </tr>

                        <tr>
                          <td><span class="style8"> 4) ชื่อหน่วยงาน.....................................................................................................................................
                              จำนวนที่รับ.......................คน
                              </span>
                          </td>
                        </tr>
                        <tr>
                          <td><span class="style8"> &nbsp;&nbsp;&nbsp; ลักษณะงาน.......................................................................................................................................................................................</span></td>
                        </tr>

                        <tr>
                        <td><span class="style8"> 5) ชื่อหน่วยงาน.....................................................................................................................................
                            จำนวนที่รับ.......................คน
                            </span>
                        </td>
                      </tr>
                      <tr>
                        <td><span class="style8"> &nbsp;&nbsp;&nbsp; ลักษณะงาน.......................................................................................................................................................................................</span></td>
                      </tr>
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
                    <td><span class="style3">&nbsp;</span></td>
                </tr>
                <tr>
                    <td align="center"><span class="style8">ลงชื่อผู้กรอกข้อมูล.................................................</span></td>
                </tr>
                <tr>
                    <td align="center"><span class="style8">(.........................................................)</span></td>
                </tr>
                <tr>
                <td align="center"><span class="style8">(เบอร์โทรศัพท์สำหรับติดต่อ.........................................................)</span></td>
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
                    <td align="center"><span class="style3">--------------------------------------------------------------------------------------------------------------------------------------------------------------</span></td>
                </tr>
                <tr>
                    <td align="center"><span class="style3"><strong> กรุณาส่งกลับ </strong> คุณชุติมา  สุดประเสริฐ งานกิจการนิสิตและศิษย์เก่าสัมพันธ์ คณะวิศวกรรมศาสตร์ </span></td>
                </tr>
                <tr>
                    <td align="center"><span class="style3"> โทรศัพท์ 055-96-4015 จดหมายอีเมล์ : training.eng.nu@gmail.com  ภายในวันที่  1  กันยายน  2566 </span></td>
                </tr>
            </table>
          </body>

        </html>
        `;
        
          newTab.document.write(htmlSubmit);
        });

        newTab.document.write('</body></html>');
        newTab.document.close();
      } else {
        console.error('Failed to open a new tab.');
      }
    } else {
      console.error('Company information is undefined or empty.');
    }
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