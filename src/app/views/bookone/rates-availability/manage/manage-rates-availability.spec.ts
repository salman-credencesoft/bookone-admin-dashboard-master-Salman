import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRatesAndAvailabilityComponent } from './manage-rates-availability.component';

describe('AvailabilityComponent', () => {
  let component: ManageRatesAndAvailabilityComponent;
  let fixture: ComponentFixture<ManageRatesAndAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRatesAndAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRatesAndAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
