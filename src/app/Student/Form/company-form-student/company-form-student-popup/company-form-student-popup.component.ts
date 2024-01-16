import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-company-form-student-popup',
  templateUrl: './company-form-student-popup.component.html',
  styleUrls: ['./company-form-student-popup.component.css']
})
export class CompanyFormStudentPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<CompanyFormStudentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCloseClick(): void {
    this.dialogRef.close({ saveData: false });
  }

  onSaveClick(): void {
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