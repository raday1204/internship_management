import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyStudentService } from 'src/app/Student/General/search-company-student/company-student/company-student.service';

interface Relation {
  id: number;
  relation_date: string;
  relation_content: string;
}

@Component({
  selector: 'app-home-officer',
  templateUrl: './home-officer.component.html',
  styleUrls: ['./home-officer.component.css']
})

export class HomeOfficerComponent implements OnInit {
  item: any;
  dateTime: Date | undefined
  relations: Relation[] = [];
  username: string = '';
  loggedInUsername: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private companyStudentService: CompanyStudentService
  ) { }

  ngOnInit() {
    this.dateTime = new Date();
    this.loggedInUsername = localStorage.getItem('loggedInUsername') || '';
    this.username = this.loggedInUsername;
    this.checkLoginStatus();

    const serverUrl = 'http://localhost/PJ/Backend/Officer/Relation/get-relation.php';

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
  // แถบข้อมูลทั่วไป 
  menuSidebar = [
    {
      link_name: "ข้อมูลนิสิตวิศวกรรมคอมพิวเตอร์",
      link: "/search-student-officer",
      icon: "fa-solid fa-users",
      sub_menu: [],
      openInNewTab: false
    },

    {
      link_name: "ข้อมูลหน่วยงาน",
      link: null,
      icon: "fa-solid fa-address-book",
      sub_menu: [
        {
          link_name: "ข้อมูลหน่วยงาน",
          link: "//search-company-officer",
        }, {
          link_name: "เพิ่มข้อมูลหน่วยงาน",
          link: "/add-company",
        }
      ],
      openInNewTab: false
    },

    {
      link_name: "ยืนยันสถานะการฝึกงาน",
      link: "/status-officer",
      icon: "fa-solid fa-user-check",
      sub_menu: [],
      openInNewTab: false
    },
  ]

  // แถบหนังสือต่างๆ
  formSidebar = [
    {
      link_name: "หนังสือขอความอนุเคราะห์รับนิสิตเข้าฝึกงาน",
      link: "/search-permission-form-officer",
      icon: "fa-regular fa-file-pdf",
      sub_menu: [],
      openInNewTab: false
    },

    {
      link_name: "หนังสือแจ้งรายชื่อนิสิตเข้าฝึกงาน",
      link: "/search-send-form-officer",
      icon: "fa-regular fa-file-pdf",
      sub_menu: [],
      openInNewTab: false
    },
    {
      link_name: "หนังสือรายงานตัวเข้าฝึกงาน",
      link: "/search-report-form-officer",
      icon: "fa-regular fa-file-pdf",
      sub_menu: [],
      openInNewTab: false
    },
    {
      link_name: "หนังสือแจ้งผู้ปกครองเรื่องการฝึกงาน",
      link: "/search-notifying-form-officer",
      icon: "fa-regular fa-file-pdf",
      sub_menu: [],
      openInNewTab: false
    },
    {
      link_name: "หนังสือขอบคุณหน่วยงาน",
      link: "/search-thanks-form-officer",
      icon: "fa-regular fa-file-pdf",
      sub_menu: [],
      openInNewTab: false
    },
    {
      link_name: "แบบฟอร์ม",
      link: '',
      icon: "fa-regular fa-file-pdf",
      sub_menu: [
        {
          link_name: "หนังสือแบบประเมินการฝึกงาน",
          link: "/assets/pdfs/แบบประเมินผลนิสิตฝึกงาน.pdf",
          openInNewTab: true
        }, {
          link_name: "แบบสำรวจความต้องการรับนิสิตเข้าฝึกงาน",
          link: "/search-evaluation-form-officer",
          openInNewTab: false
        }
      ],
    },
  ]

  aboutUs = [
    {
      link_name: "About Us",
      link: "/about-us-of",
      icon: "fa-solid fa-users",
      sub_menu: [],
      openInNewTab: false
    },
  ]

  // แถบแจ้งข่าวประชาสัมพันธ์
  newsSidebar = [
    {
      link_name: "เพิ่ม-ลบ-แก้ไขข่าวประชาสัมพันธ์",
      link: "/relation-officer",
      icon: "fa-solid fa-bullhorn",
      sub_menu: [],
      openInNewTab: false
    },
  ]
  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
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

  //ข่าวประชาสัมพันธ์
  isNew(date: string): boolean {
    const newsDate = new Date(date);
    const today = new Date();
    const differenceInDays = Math.floor((today.getTime() - newsDate.getTime()) / (1000 * 3600 * 24));
    return differenceInDays < 2;
  }

  //ตรวจสอบusername
  checkLoginStatus() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/home-student.php', { username: this.username })
      .subscribe(
        (response: any) => {
          if (response.loggedIn) {
            this.username = response.username;
            console.log(`Welcome, ${this.username}, to the home-student page!`);
            this.companyStudentService.setUsername(this.username);
            // Navigate to company-information with the username as a query parameter
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { username: this.username },
              queryParamsHandling: 'merge'
            });
          } else {
            this.router.navigate(['/login-officer']);
          }
        },
        (error) => {
          console.error('An error occurred:', error);
        }
      );
  }

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');
          this.username = ''; // Reset username
          this.router.navigateByUrl('/login-officer', { replaceUrl: true });
        },
        (error) => {
          console.error('Logout error:', error);
        }
      );
  }
}