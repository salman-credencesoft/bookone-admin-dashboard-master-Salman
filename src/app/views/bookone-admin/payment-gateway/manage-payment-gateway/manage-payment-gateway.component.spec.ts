import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePaymentGatewayComponent } from './manage-payment-gateway.component';

describe('ManagePaymentGatewayComponent', () => {
  let component: ManagePaymentGatewayComponent;
  let fixture: ComponentFixture<ManagePaymentGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePaymentGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePaymentGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
