import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-failure-transaction',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './failure-transaction.component.html',
  styleUrl: './failure-transaction.component.scss'
})
export class FailureTransactionComponent {
  constructor(private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['admin/subscription']);
    }, 2000);
  }
}
