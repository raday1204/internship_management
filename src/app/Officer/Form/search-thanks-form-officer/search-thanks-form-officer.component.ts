import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStorageService } from 'src/app/Officer/General/search-company-officer/company-information/data-storage.service';

@Component({
  selector: 'app-search-thanks-form-officer',
  templateUrl: './search-thanks-form-officer.component.html',
  styleUrls: ['./search-thanks-form-officer.component.css']
})
export class SearchThanksFormOfficerComponent {
  selectedOption1: any;
  selectedOption2: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private http: HttpClient,
    private dataStorageService: DataStorageService
    ) {}

    ngOnInit() {
      this.getOptions();
    }
  
    getOptions() {
      this.http.get('http://localhost/PJ/Backend/Officer/Company/get-company-officer.php').subscribe((data: any) => {
        if (Array.isArray(data)) {
          // Create a Set to store unique values for selectedOption1 and selectedOption2
          const uniqueYears = new Set(data.map((item: any) => item.year));
          const uniqueTypeCodes = new Set(data.map((item: any) => item.type_code));
  
          this.selectedOption1 = Array.from(uniqueYears);
          this.selectedOption2 = Array.from(uniqueTypeCodes);
        } else if (typeof data === 'number') {
          console.error('Invalid data structure in the API response.');
        }
      });
    }
  
    submitForm() {
      const formData = new FormData();
      formData.append('year', this.selectedOption1);
      formData.append('type_code', this.selectedOption2);
    
      this.http.post('http://localhost/PJ/Backend/Officer/Company/company-officer.php', formData)
        .subscribe((response: any) => {
          console.log('Backend Response:', response);
    
          if (response.company && Array.isArray(response.company)) {
            // Assuming you only need the company data, not student and need_student
            this.dataStorageService.setYearTypecode(this.selectedOption1, this.selectedOption2);
    
            this.router.navigate(['/thanks-form'], {
              relativeTo: this.route,
              queryParams: {
                year: this.selectedOption1,
                type_code: this.selectedOption2
              },
              queryParamsHandling: 'merge'
            });
          } else {
            console.error('Invalid response from server.');
          }
        },
        (error) => {
          console.error('HTTP Error:', error);
        });
    }
  }  

