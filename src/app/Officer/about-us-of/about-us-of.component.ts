import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us-of',
  templateUrl: './about-us-of.component.html',
  styleUrls: ['./about-us-of.component.css']
})
export class AboutUsOfComponent {

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {  }

  logout() {
    this.http.post<any>('http://localhost/PJ/Backend/Student/logout.php', {})
      .subscribe(
        () => {
          localStorage.removeItem('loggedInUsername');
          localStorage.removeItem('companyID');
          // Replace the current navigation history with the login page
          this.router.navigateByUrl('/login-officer', { replaceUrl: true });
        },
        (error: any) => {
          console.error('Logout error:', error);
        }
      );
  }
}
