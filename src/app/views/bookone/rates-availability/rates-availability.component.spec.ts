import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatesAndAvailabilityComponent } from './rates-availability.component';

describe('BookingComponent', () => {
  let component: RatesAndAvailabilityComponent;
  let fixture: ComponentFixture<RatesAndAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatesAndAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesAndAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
