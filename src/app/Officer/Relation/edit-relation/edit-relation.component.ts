import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditRelationPopupComponent } from 'src/app/Officer/Relation/edit-relation/edit-relation-popup/edit-relation-popup.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-relation',
  templateUrl: './edit-relation.component.html',
  styleUrls: ['./edit-relation.component.css']
})
export class EditRelationComponent implements OnInit {
  relationForm: FormGroup;
  relationId: any;
  displayedFilePath: string = '';
  username: string = '';
  loggedInUsername: string = '';
  fileType: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
  ) {
    this.relationForm = this.fb.group({
      relation_date: ['', Validators.required],
      relation_content: ['', Validators.required],
      relation_pic: ['']
    });
  }

  ngOnInit(): void {
    this.relationId = this.route.snapshot.params['id'];
    this.loadRelationData();

    this.loggedInUsername = localStorage.getItem('loggedInUsername') || '';
    this.username = this.loggedInUsername;
    if (!this.username) {
      this.router.navigateByUrl('/login-officer', { replaceUrl: true });
      return;
    }
  }

  openDatePicker() { }

  // edit-relation.component.ts

  getSafeIframeUrl(filePath: string | SafeResourceUrl): SafeResourceUrl {
    if (typeof filePath === 'string') {
      // Check if it's a DOC file
      if (this.isDoc(filePath)) {
        // Generate a safe URL for the DOC file
        return this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
      }

      // Return the file URL as is for other formats
      return this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
    }

    // If the filePath is not a string, return an empty string
    return '';
  }

  loadRelationData() {
    this.fetchRelationDetails(this.relationId).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.relationForm.patchValue(response.data);
          this.displayedFilePath = `http://localhost${response.data.relation_pic}`;
          console.log('Displayed File Path:', this.displayedFilePath);
          const fileType = this.getFileType(this.displayedFilePath);

          if (fileType === 'doc') {
            // Load the converted PDF instead
            this.loadDocFile(response.data.relation_pic);
          } else {
            this.fileType = fileType;
          }
        } else {
          console.error('Invalid response format: data property is missing.');
        }
      },
      (error) => {
        console.error('Error fetching relation data:', error);
      }
    );
  }

  getGoogleDocsViewerUrl(filePath: string) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(filePath)}`;
  }

  loadDocFile(docFileUrl: string): void {
    // Update the fileType to 'pdf' if needed
    this.fileType = 'doc';

    // Set the displayedFilePath to the URL of the converted PDF
    this.displayedFilePath = docFileUrl;
    console.log(' file URL:', docFileUrl);
  }

  getFileType(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();

    if (!extension) {
      return 'unsupported';
    }

    if (['jpeg', 'jpg', 'gif', 'png'].includes(extension)) {
      return 'image';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'doc';
    } else if (extension === 'pdf') {
      return 'pdf';
    } else {
      return 'unsupported';
    }
  }

  fetchRelationDetails(relationId: string) {
    return this.http.get(`http://localhost/PJ/Backend/Officer/Relation/get-relation-details.php?id=${relationId}`);
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.type.match(/image.*/)) {
        this.fileType = 'image';
      } else if (file.type === 'application/pdf') {
        this.fileType = 'pdf';
      } else if (['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
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

  isImage(filePath: string | SafeResourceUrl): boolean {
    if (typeof filePath === 'string') {
      // Assuming image files end with these extensions, adjust this based on your file naming conventions
      return /\.(jpeg|jpg|gif|png)$/i.test(filePath);
    }
    return false;
  }

  isPdf(filePath: string | SafeResourceUrl): boolean {
    if (typeof filePath === 'string') {
      return /\.pdf$/i.test(filePath);
    }
    return false;
  }

  isDoc(filePath: string | SafeResourceUrl): boolean {
    if (typeof filePath === 'string') {
      return /\.(doc|docx)$/i.test(filePath);
    }
    return false;
  }

  createLocalFileUrl(file: File): void {
    if (file) {
      try {
        const fileUrl = URL.createObjectURL(file);
        console.log('Created file URL:', fileUrl);
        this.displayedFilePath = (fileUrl);
      } catch (error) {
        console.error('Error creating file URL:', error);
        throw error; // Rethrow the error for further handling
      }
    } else {
      console.error('File is null');
    }
  }

  openPopup(): void {
    const formattedDate = this.relationForm.value.relation_date ?
      formatDate(this.relationForm.value.relation_date, 'yyyy-MM-dd', 'th-TH') : '';

    const dialogRef = this.dialog.open(EditRelationPopupComponent, {
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
        this.editRelation();
      }
    });
  }

  editRelation() {
    const formattedDate = this.relationForm.value.relation_date ?
      formatDate(this.relationForm.value.relation_date, 'yyyy-MM-dd', 'th-TH') : '';
    const formData = new FormData();
    formData.append('relation_date', formattedDate);
    formData.append('relation_content', this.relationForm.value.relation_content);
    formData.append('file', this.relationForm.value.relation_pic);

    const serverUrl = `http://localhost/PJ/Backend/Officer/Relation/update-relation.php?id=${this.relationId}`;

    this.http.post(serverUrl, formData).subscribe(
      (response: any) => {
        console.log('Backend Response:', response);
        if (response.success) {
          console.log(response.message);
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