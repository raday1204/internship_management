import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-relation-popup',
  templateUrl: './add-relation-popup.component.html',
  styleUrls: ['./add-relation-popup.component.css']
})
export class AddRelationPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<AddRelationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onCancel(): void {
    this.dialogRef.close({ saveData: false })
  }

  onSubmit(): void {
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