import { TestBed } from '@angular/core/testing';

import { PaymentGatewayServiceService } from './payment-gateway-service.service';

describe('PaymentGatewayServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentGatewayServiceService = TestBed.get(PaymentGatewayServiceService);
    expect(service).toBeTruthy();
  });
});
