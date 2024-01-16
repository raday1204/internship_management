import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteRelationPopupComponent } from './delete-relation-popup/delete-relation-popup.component';

interface Relation {
  id: number;
  relation_date: string;
  relation_content: string;
}

@Component({
  selector: 'app-relation-officer',
  templateUrl: './relation-officer.component.html',
  styleUrls: ['./relation-officer.component.css']
})
export class RelationOfficerComponent implements OnInit {
  relations: Relation[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  username: string = '';
  loggedInUsername: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loggedInUsername = localStorage.getItem('loggedInUsername') || '';
    this.username = this.loggedInUsername;
    if (!this.username) {
      this.router.navigateByUrl('/login-officer', { replaceUrl: true });
      return;
    }

    this.fetchRelations(this.currentPage, this.itemsPerPage);
  }

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

  deleteRelation(relationId: number) {
    const dialogRef = this.dialog.open(DeleteRelationPopupComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.confirmDelete(relationId);
      }
    });
  }

  confirmDelete(relationId: number) {
    const serverUrl = `http://localhost/PJ/Backend/Officer/Relation/delete-relation.php?id=${relationId}`;
    this.http.delete(serverUrl).subscribe(
      (response: any) => {
        console.log('Delete Response:', response);
        if (response.success) {
          // Update the relations array by filtering out the deleted relation
          this.relations = this.relations.filter((relation) => relation.id !== relationId);
        } else {
          console.error('Delete Error:', response.message);
          // Handle delete error here
        }
      },
      (error) => {
        console.error('HTTP Error:', error);
        // Handle HTTP error here
      }
    );
  }

  editRelation(relationId: number) {
    // Navigate to the edit page with the relation ID
    this.router.navigate(['/edit-relation', relationId]);
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