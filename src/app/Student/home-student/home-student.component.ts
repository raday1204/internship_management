import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyStudentService } from '../General/search-company-student/company-student/company-student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Relation {
  id: number;
  relation_date: string;
  relation_content: string;
  relation_pic: string;
}

@Component({
  selector: 'app-home-student',
  templateUrl: './home-student.component.html',
  styleUrls: ['./home-student.component.css']
})

export class HomeStudentComponent implements OnInit {
  [x: string]: any;
  dateTime: Date | undefined
  username: string = '';
  loggedInUsername: string = '';
  relations: Relation[] = [];
  hasSelectedCompany: boolean = false;
  relationForm: FormGroup;
  displayedFilePath: string = '';
  relationId: any;
  relation: any = {
    relation_date: '',
    relation_content: '',
    relation_pic: ''
  };
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private companyStudentService: CompanyStudentService
  ) {
    this.relationForm = this.fb.group({
      relation_date: ['', Validators.required],
      relation_content: ['', Validators.required],
      relation_pic: ['']
    });

  }


  ngOnInit() {
    this.dateTime = new Date();
    this.loggedInUsername = localStorage.getItem('loggedInUsername') || '';
    this.username = this.loggedInUsername;
    this.checkLoginStatus();

    const serverUrl = 'http://localhost/PJ/Backend/Student/get-relation-student.php';

    this.http.get<{ data: Relation[] }>(serverUrl).subscribe(
      (response) => {
        this.relations = response.data;
      },
      (error) => {
        console.error('HTTP Error:', error);
        // Handle error here
      }
    );
  }

  //open new tab for display relations detail
  openInNewTab(relationItem: any): void {
    if (relationItem) {
      const relationId = relationItem.id;
      this.http.get(`http://localhost/PJ/Backend/Officer/Relation/get-relation-details.php?id=${relationId}`).subscribe(
        (response: any) => {
          console.log('Backend Response:', response.data);

          this.displayedFilePath = `http://localhost${response.data.relation_pic}`;
          console.log('PDF:', this.displayedFilePath);

          const newTab = window.open('', '_blank');
          if (newTab) {
            newTab.document.write(`
              <html>
                <head>
                  <title>รายละเอียดข่าวประชาสัมพันธ์</title>
                    <style type="text/css">
                      <!--
                      .style3 {
                          font-family: "TH SarabunPSK";
                          font-size: 20px;
                      }

                      .style8 {
                          font-family: "TH SarabunPSK";
                          font-size: 16px;
                      }
                      -->
                  </style>
                </head>

                <body topmargin="top">
                  <table width="620" border="0" align="center">
                    <tr>
                      <td align="center"><span class="style3">
                        <strong> ข่าวประชาสัมพันธ์ </strong></span>
                      </td>
                    </tr>

                    <tr>
                      <td><span class="style3">&nbsp;</span></td>
                    </tr>

                    <tr>
                      <td>
                        <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="70">
                                <span class="style8">
                                    <strong> วันที่ : </strong>
                                </span>
                              </td>
                              <td>
                                <span class="style8">
                                    ${this.formatDate(response.data.relation_date)}
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
                          <td>
                            <span class="style8" style="vertical-align: top;">
                                <strong> เนื้อหา: </strong> 
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                ${response.data.relation_content}
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
                    <td align="center">
                    <table width="100%" border="0" align="center">
                      ${this.displayMedia(response.data.relation_pic)}
                    </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            `);
            newTab.document.close();
          }
        },
        (error) => {
          console.error('Error fetching relation data:', error);
        }
      );
    }
  }

  displayMedia(relationPic: string): string {
    if (relationPic) {
      if (this.isPdf(relationPic)) {
        return `<tr><td><embed src="${this.displayedFilePath}" type="application/pdf" style="width: 100%; height: 800px;"></embed></td></tr>`;
      } else {
        return `<tr><td class="text-center" style="text-align: center;"><img src="${this.displayedFilePath}" style="max-width: 100%;"></td></tr>`;
      }
    }
    return '';
  }

  isPdf(filePath: string): boolean {
    return filePath.toLowerCase().endsWith('.pdf');
  }

  formatDate(date: string | null): string {
    if (date !== null) {
      const formattedDate = new Date(date);
      // Use Thai locale and Buddhist calendar
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const transformedDate = formattedDate.toLocaleDateString('th-TH-u-ca-buddhist', options);
      return transformedDate || '';
    } else {
      return '';
    }
  }

  menuSidebar = [
    {
      link_name: "คำอธิบายรายวิชา",
      link: "/assets/pdfs/คำอธิบายรายวิชา.pdf",
      icon: "fa-regular fa-paste",
      sub_menu: [],
      openInNewTab: true
    },

    {
      link_name: "ข้อแนะนำฝึกงาน",
      link: "/assets/pdfs/ข้อแนะนำฝึกงาน.pdf",
      icon: "fa-regular fa-thumbs-up",
      sub_menu: [],
      openInNewTab: true
    },

    {
      link_name: "ปฏิทินฝึกงาน",
      link: "/search-calendar-student",
      icon: "fa-regular fa-calendar",
      sub_menu: [],
      openInNewTab: false
    },

    {
      link_name: "ข้อมูลประวัติส่วนตัว",
      link: '/profile-student',
      icon: "fa-solid fa-clipboard-user",
      sub_menu: [],
      openInNewTab: false

    },

    {
      link_name: "ข้อมูลหน่วยงาน",
      link: "/search-company-student",
      icon: "fa-solid fa-list",
      sub_menu: [],
      openInNewTab: false
    },

    {
      link_name: "ตรวจสอบสถานะ",
      action: () => this.checkCompanyStatus(),// link: "/wait-status",
      icon: "fa-solid fa-user-check",
      sub_menu: [],
      openInNewTab: false
    },

    {
      link_name: "ตรวจสอบสถานะแบบประเมิน",
      action: () => this.checkAssessmentStatus(),// link: "/wait-status",
      icon: "fa-solid fa-file-circle-check",
      sub_menu: [],
      openInNewTab: false
    },

    {
      link_name: "ผู้ประสานงานด้านการฝึกงาน",
      link: "/assets/pdfs/ผู้ประสานงานด้านการฝึกงาน.pdf",
      icon: "fa-solid fa-person-circle-question",
      sub_menu: [],
      openInNewTab: true
    },
  ]

  formSidebar = [
    {
      link_name: "คู่มือการฝึกงานเสริมสร้างทักษะประสบการณ์วิชาชีพวิศวกรรม",
      link: "/assets/pdfs/สำหรับนิสิตคอมพิวเตอร์-คู่มือการฝึกงานเสริมสร้างทักษะประสบการณ์วิชาชีพวิศวกรรม.pdf",
      icon: "fa-regular fa-circle-question",
      sub_menu: [],
      openInNewTab: true
    },

    {
      link_name: "01-ข้อมูลหน่วยงาน",
      action: () => this.CompanyStatus(),
      icon: "fa-regular fa-file-pdf",
      sub_menu: [],
      openInNewTab: false
    },

    {
      link_name: "แบบบันทึกประจำวัน",
      link: "/assets/pdfs/แบบบันทึกประจำวัน.pdf",
      icon: "fa-regular fa-file-pdf",
      sub_menu: [],
      openInNewTab: true
    },

    {
      link_name: "สถานประกอบการในมุมมองของนิสิต",
      link: "/assets/pdfs/สถานประกอบการในมุมมองของนิสิต.pdf",
      icon: "fa-regular fa-file-pdf",
      sub_menu: [],
      openInNewTab: true
    },
  ]

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }

  checkLoginStatus() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/home-student.php', { username: this.username })
      .subscribe(
        (response: any) => {
          if (response.loggedIn) {
            this.username = response.username;
            console.log(`Welcome, ${this.username}, to the home-student page!`);
            this.companyStudentService.setUsername(this.username);

            // Check if the user already has a company ID
            this.http.post<any>('http://localhost/PJ/Backend/Student/check-company-id.php', { username: this.username })
              .subscribe(
                (companyResponse: any) => {
                  if (companyResponse.success) {
                    if (companyResponse.hasCompanyID) {
                      console.log('Welcome, Company ID:', companyResponse.companyID);

                      // Store the company ID in localStorage
                      localStorage.setItem('companyID', companyResponse.companyID);
                      this.hasSelectedCompany = true;

                      if (companyResponse.companyID === 0) {
                        // Redirect to company-form-student if company_id is 0
                        this.hasSelectedCompany = true;
                      } else {
                        // Navigate to company-information with the username as a query parameter
                        this.router.navigate([], {
                          relativeTo: this.route,
                          queryParams: { username: this.username },
                          queryParamsHandling: 'merge'
                        });
                      }
                    } else {
                      // Allow selection of a company when company_id is 0
                      this.hasSelectedCompany = false;
                    }
                  } else {
                    console.error('An error occurred while checking company ID:', companyResponse.error);
                  }
                },
                (error) => {
                  console.error('An error occurred while checking company ID:', error);
                }
              );
          } else {
            // Redirect to login page if not logged in
            this.router.navigate(['/login-student']);
          }
        },
        (error) => {
          console.error('An error occurred:', error);
        }
      );
  }

  //Company-Status
  checkCompanyStatus() {
    console.log('Checking training status for username:', this.username);
    const requestBody = { username: this.username };

    this.http.post<any>('http://localhost/PJ/Backend/Student/Training/check-training-status.php', JSON.stringify(requestBody))
      .subscribe(
        (response: any) => {
          if (response && response.success) {
            const trainingData = response.data.trainingData;  // Match the key with PHP response
            console.log('Training Data:', trainingData);

            if (trainingData.length > 0) {
              const company_status = trainingData[0].company_status;
              if (company_status === '1') {
                this.router.navigate(['/wait-status']);
              } else if (company_status === '2') {
                this.router.navigate(['/confirm-status']);
              } else if (company_status === '3') {
                localStorage.removeItem('selectedCompanyID');
                this.router.navigate(['/cancel-status']);
              }
            } else {
              // console.log('No training status found.');
              this.snackBar.open('ยังไม่ได้เลือกหน่วยงาน', 'Close', {
                duration: 3000,
              });
            }
          } else {
            console.log('No training status found or an error occurred.');
          }
        },
        (error) => {
          console.error('An error occurred while checking training status:', error);
        }
      );
  }

  //Assessment-Status
  checkAssessmentStatus() {
    console.log('Checking training status for username:', this.username);
    const requestBody = { username: this.username };

    this.http.post<any>('http://localhost/PJ/Backend/Student/Training/check-training-status.php', JSON.stringify(requestBody))
      .subscribe(
        (response: any) => {
          if (response && response.success) {
            const trainingData = response.data.trainingData;  // Match the key with PHP response
            console.log('Training Data:', trainingData);

            if (trainingData.length > 0) {
              const assessment_status = trainingData[0].assessment_status;
              if (assessment_status === '1') {
                this.router.navigate(['/wait-assessment-status']);
              } else if (assessment_status === '2') {
                this.router.navigate(['/confirm-assessment-status']);
              }
            } else {
              // console.log('No training status found.');
              this.snackBar.open('ยังไม่ได้เลือกหน่วยงาน', 'Close', {
                duration: 3000,
              });
            }
          } else {
            console.log('No training status found or an error occurred.');
          }
        },
        (error) => {
          console.error('An error occurred while checking training status:', error);
        }
      );
  }

  CompanyStatus() {
    console.log('Checking training status for username:', this.username);
    const requestBody = { username: this.username };

    this.http.post<any>('http://localhost/PJ/Backend/Student/check-company-id.php', { username: this.username })
      .subscribe(
        (companyResponse: any) => {
          if (companyResponse.success) {
            if (companyResponse.hasCompanyID) {
              console.log('Welcome, Company ID:', companyResponse.companyID);

              // Store the company ID in localStorage
              localStorage.setItem('companyID', companyResponse.companyID);
              this.hasSelectedCompany = true;

              if (companyResponse.companyID === 0) {
                this.router.navigate(['/company-form-student']);
              } else {
                this.http.post<any>('http://localhost/PJ/Backend/Student/Training/check-training-status.php', JSON.stringify(requestBody))
                  .subscribe(
                    (statusResponse: any) => {
                      if (statusResponse && statusResponse.success) {
                        const trainingData = statusResponse.data.trainingData;  // Match the key with PHP response
                        console.log('Training Data:', trainingData);

                        if (trainingData.length > 0) {
                          const company_status = trainingData[0].company_status;

                          if (company_status === '1' || company_status === '2') {
                            this.snackBar.open('ไม่สามารถเปลี่ยนหน่วยงานได้', 'Close', {
                              duration: 3000,
                            });
                          } else if (company_status === '3') {
                            this.router.navigate(['/company-form-student']);
                          }
                        } else {
                          // No training status found.
                          this.snackBar.open('ยังไม่ได้เลือกหน่วยงาน', 'Close', {
                            duration: 3000,
                          });
                        }
                      } else {
                        console.error('No training status found or an error occurred.');
                      }
                    },
                    (error) => {
                      console.error('An error occurred while checking training status:', error);
                    }
                  );
              }
            } else {
              // Allow selection of a company when company_id is 0
              this.hasSelectedCompany = false;
            }
          } else {
            console.error('An error occurred while checking company ID:', companyResponse.error);
          }
        },
        (error) => {
          console.error('An error occurred while checking company ID:', error);
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

  isNew(date: string): boolean {
    const newsDate = new Date(date);
    const today = new Date();
    const differenceInDays = Math.floor((today.getTime() - newsDate.getTime()) / (1000 * 3600 * 24));
    return differenceInDays < 2;
  }
}