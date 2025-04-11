import { Component } from '@angular/core';
import { OrganizationService } from '../../../services/organizationService';
import { FilterService, GridModule, GroupService, PageService, PageSettingsModel, SortService } from '@syncfusion/ej2-angular-grids';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent {
  public pageSettings?: PageSettingsModel;
  data: any[] = []; 
  displayedColumns: string[] = ['name','actions'];
  constructor(private readonly organizationService: OrganizationService,
    private readonly snackbar:MatSnackBar
  ) {
  }

  ngOnInit() {
    this.pageSettings = { pageSize: 6 };
    this.organizationService.getOrganizations().subscribe({
      next: (data) => {
        this.data = data.organizations.data
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  markAsExpired(organizationId: string): void {
    this.organizationService.markExpire(organizationId).subscribe({
      next: () => {
        this.snackbar.open('Plan marked as expired', 'Close', { duration: 3000 });
        this.ngOnInit(); // If you want to reload data
      },
      error: (err: any) => {
        console.error('Error marking as expired:', err);
        this.snackbar.open('Error marking as expired', 'Close', { duration: 3000 });
      }
    });
  }
}
