import { Component } from '@angular/core';
import { OrganizationService } from '../../../services/organizationService';
import { FilterService, GridModule, GroupService, PageService, PageSettingsModel, SortService } from '@syncfusion/ej2-angular-grids';
import { MatTableModule } from '@angular/material/table';

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
  constructor(private readonly organizationService: OrganizationService) {
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
}
