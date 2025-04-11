import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success-transaction',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './success-transaction.component.html',
  styleUrl: './success-transaction.component.scss'
})
export class SuccessTransactionComponent implements OnInit {
  sessionId!: string;
  orderId!: string;

  constructor(private route: ActivatedRoute,
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id') || '';
    this.orderId = this.route.snapshot.queryParamMap.get('order_id') || '';
    console.log('Payment successful for session:', this.sessionId, 'Order:', this.orderId);
    setTimeout(() => {
      this.router.navigate(['admin/dashboard']);
    }, 2000);
  }
}