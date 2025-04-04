import { Component } from '@angular/core';
import { AddUsersComponent } from '../add-users/add-users.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule, 
    CommonModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  constructor(

    public dialog: MatDialog,
   
  ) {}

  ngOnInit(): void {
   
    this.init();
  }

  async init() {
   
  }

  openAddUsers(element: any) {
    const dialogRef = this.dialog.open(AddUsersComponent, {
      data: { productData: element },
      width: '600px',
      height: '400px',
      disableClose: true,
      panelClass: 'centered-dialog' // this applies a custom style
    });
  
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
      }
    });
  }
  
  
}
