import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddRelationPopupComponent } from './add-relation-popup/add-relation-popup.component';
import { CompanyStudentService } from 'src/app/Student/General/search-company-student/company-student/company-student.service';
import { SafePipe } from '../safe.pipe';
@Component({
  selector: 'app-add-relation',
  templateUrl: './add-relation.component.html',
  styleUrls: ['./add-relation.component.css'],
  providers: [SafePipe]
})
export class AddRelationComponent {
  relationForm: FormGroup;
  relation: any = {
    relation_date: '',
    relation_content: '',
    relation_pic: null
  };
  displayedFilePath: string = '';
  username: string = '';
  fileType: string = ''; 
  
  constructor(
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private companyStudentService: CompanyStudentService
  ) {
    this.relationForm = this.fb.group({
      relation_date: ['', Validators.required],
      relation_content: ['', Validators.required],
      relation_pic: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.username = this.companyStudentService.getUsername();
    console.log('Username from service:', this.username);

    if (!this.username) {
      this.router.navigateByUrl('/login-officer', { replaceUrl: true });
      return;
    }
  }

  openDatePicker() {
    // You can perform any additional logic here if needed
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
  
      if (file.type.match(/image.*/)) {
        this.fileType = 'image';
      } else if (file.type === 'application/pdf') {
        this.fileType = 'pdf';
      } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.fileType = 'doc';
      } else {
        console.error('Unsupported file type');
        return;
      }
      this.relationForm.patchValue({ relation_pic: file });
      try {
        this.createLocalFileUrl(file);
      } catch (error) {
        console.error('Error creating local file URL:', error);
      }
    }
  }
  
  createLocalFileUrl(file: File): void {
    if (file) {
      try {
        const fileUrl = URL.createObjectURL(file);
        console.log('Created file URL:', fileUrl);
        this.displayedFilePath = fileUrl;
      } catch (error) {
        console.error('Error creating file URL:', error);
        throw error;
      }
    } else {
      console.error('File is null');
    }
  }
  

  openPopup(): void {
    if (this.relationForm.valid) {
      const formattedDate = this.relationForm.value.relation_date ?
        formatDate(this.relationForm.value.relation_date, 'yyyy-MM-dd', 'en-US') : '';

      const dialogRef = this.dialog.open(AddRelationPopupComponent, {
        data: {
          relation: {
            relation_date: formattedDate,
            relation_content: this.relationForm.value.relation_content,
            relation_pic: this.relationForm.value.relation_pic
          }
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result && result.saveData) {
          this.saveRelation();
        }
      });
    } else {
      this.snackBar.open('กรุณากรอกข้อมูลให้ครบถ้วน', 'Close', {
        duration: 3000,
      });
    }
  }

  saveRelation() {
    const formattedDate = this.relationForm.value.relation_date ?
      formatDate(this.relationForm.value.relation_date, 'yyyy-MM-dd', 'en-US') : '';

    const formData = new FormData();
    formData.append('relation_date', formattedDate);
    formData.append('relation_content', this.relationForm.value.relation_content);
    formData.append('file', this.relationForm.value.relation_pic);
    formData.append('upload_path', '/PJ/Backend/Officer/uploads/' + this.relationForm.value.relation_pic.name);
    const serverUrl = 'http://localhost/PJ/Backend/Officer/Relation/add-relation.php';

    this.http.post(serverUrl, formData)
      .subscribe(
        (response: any) => {
          console.log('Backend Response:', response);
          if (response.success) {
            console.log(response.message);
            this.displayedFilePath = response.file_path; 
            console.log(this.displayedFilePath);
            this.router.navigate(['/relation-officer']);
          } else {
            console.error('Backend Error:', response.message);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);

          if (error.error instanceof ErrorEvent) {
            console.error('Client-side error:', error.error.message);
          } else {
            console.error('Server-side error:', error.error);
          }
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