import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareReservationComponent } from './prepare-reservation.component';

describe('PrepareReservationComponent', () => {
  let component: PrepareReservationComponent;
  let fixture: ComponentFixture<PrepareReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepareReservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrepareReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
