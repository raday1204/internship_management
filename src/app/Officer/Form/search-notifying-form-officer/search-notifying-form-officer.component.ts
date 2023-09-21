import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginStudentService } from 'src/app/Student/login-student/login-student.service';

@Component({
  selector: 'app-search-notifying-form-officer',
  templateUrl: './search-notifying-form-officer.component.html',
  styleUrls: ['./search-notifying-form-officer.component.css']
})
export class SearchNotifyingFormOfficerComponent {
  selectedOption1: string | undefined;
  selectedOption2: string | undefined;
  searchTerm: string = '';

  constructor(private router: Router, private loginStudentService: LoginStudentService) {}

  submitForm() {
    // Send data to service or perform any other actions here
    this.router.navigate(['/company'], { 
      queryParams: { option1: this.selectedOption1, option2: this.selectedOption2 } 
    });
  }

  search() {
    this.loginStudentService['searchData'](this.selectedOption1, this.selectedOption2, this.searchTerm)
      .subscribe((results: any) => {
        // Process the search results here
        console.log(results);
      });
  }
}