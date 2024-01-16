// edit-company-popup.component.ts
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStorageService } from 'src/app/Officer/General/search-company-officer/company-information/data-storage.service';

@Component({
  selector: 'app-edit-company-popup',
  templateUrl: './edit-company-popup.component.html',
  styleUrls: ['./edit-company-popup.component.css']
})
export class EditCompanyPopupComponent implements OnInit {

  companyName: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditCompanyPopupComponent>,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['CompanyInformation']) {
        const parsedData = JSON.parse(params['CompanyInformation']);
        this.companyName = parsedData.company_name;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close({ saveData: false });
  }

  onSubmit() {
    this.dialogRef.close({ saveData: true });
  }

  formatDateThai(date: string | null): string {
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
}