import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureTransactionComponent } from './failure-transaction.component';

describe('FailureTransactionComponent', () => {
  let component: FailureTransactionComponent;
  let fixture: ComponentFixture<FailureTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FailureTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
