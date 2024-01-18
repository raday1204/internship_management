import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Relation {
  id: number;
  relation_date: string;
  relation_content: string;
}

@Component({
  selector: 'app-all-relation',
  templateUrl: './all-relation.component.html',
  styleUrls: ['./all-relation.component.css']
})

export class AllRelationComponent implements OnInit {

  dateTime: Date | undefined
  username: string = '';
  loggedInUsername: string = '';
  relations: Relation[] = [];
  displayedFilePath: string = '';

  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchRelations(this.currentPage, this.itemsPerPage);
  }

  //แสดงข้อมูลข่าวโดยจากกการเลือก page and limit
  fetchRelations(page: number, limit: number): void {
    const serverUrl = `http://localhost/PJ/Backend/Officer/Relation/get-relation.php?page=${page}&limit=${limit}`;

    this.http.get<{ data: Relation[] }>(serverUrl).subscribe(
      (response) => {
        this.relations = response.data;
      },
      (error) => {
        console.error('HTTP Error:', error);
      }
    );
  }

  //open new tab for display relations detail
  openInNewTab(relationItem: any): void {
    if (relationItem) {
      const relationId = relationItem.id; // Assuming id is the property holding relation_id
      this.http.get(`http://localhost/PJ/Backend/Officer/Relation/get-relation-details.php?id=${relationId}`).subscribe(
        (response: any) => {
          console.log('Backend Response:', response);
          this.displayedFilePath = `http://localhost${response.data.relation_pic}`;
          const newTab = window.open('', '_blank');
          if (newTab) {
            newTab.document.write(`
              <html>
                <head>
                  <title>Image Preview</title>
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
                    <td>
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

  //display image and pdf
  displayMedia(relationPic: string): string {
    if (relationPic) {
      if (this.isPdf(relationPic)) {
        return `<tr><td><embed src="${this.displayedFilePath}" type="application/pdf" style="width: 100%; height: 800px;"></embed></td></tr>`;
      } else {
        return `<tr><td><img src="${this.displayedFilePath}" style="max-width: 100%;"></td></tr>`;
      }
    }
    return '';
  }

  isPdf(filePath: string): boolean {
    return filePath.toLowerCase().endsWith('.pdf');
  }

  //แสดงวันที่เป็นภาษาไทย
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

  paginate(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.fetchRelations(this.currentPage, this.itemsPerPage);
  }

  isNew(date: string): boolean {
    const newsDate = new Date(date);
    const today = new Date();
    const differenceInDays = Math.floor((today.getTime() - newsDate.getTime()) / (1000 * 3600 * 24));
    return differenceInDays < 2;
  }

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');
          localStorage.removeItem('companyID');
          // Replace the current navigation history with the login page
          this.router.navigateByUrl('/login-student', { replaceUrl: true });
        },
        (error) => {
          console.error('Logout error:', error);
        }
      );
  }
}