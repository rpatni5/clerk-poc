import { AfterViewInit, Component } from '@angular/core';
import { OrganizationService } from '../../../services/organizationService';
import { FilterService, GridModule, GroupService, PageService, PageSettingsModel, SortService } from '@syncfusion/ej2-angular-grids';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ClerkService } from '../../../services/clerkService';
import { take } from 'rxjs';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent implements AfterViewInit {
  public pageSettings?: PageSettingsModel;
  data: any[] = [];
  displayedColumns: string[] = ['name', 'actions'];
  constructor(private readonly organizationService: OrganizationService,
    private readonly snackbar: MatSnackBar,
    private clerkService: ClerkService,

  ) {
  }

  ngOnInit() {
    this.pageSettings = { pageSize: 6 };
    this.organizationService.getOrganizations().subscribe({
      next: (data) => {
        this.data = data
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
      if (!clerk) {
        console.error("Clerk is not initialized.");
        return;
      }
      const currentUser = clerk.user;
      if (!currentUser) {
        console.error("No user found.");
        return;
      }
      const accountAdminMembership = currentUser.organizationMemberships.find(membership =>
        membership.role === 'org:system_administrator'
      );
      if (!accountAdminMembership) {
        window.location.href = '/admin/dashboard'
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
