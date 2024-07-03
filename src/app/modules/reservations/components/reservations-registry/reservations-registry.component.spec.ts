import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsRegistryComponent } from './reservations-registry.component';

describe('ReservationsRegistryComponent', () => {
  let component: ReservationsRegistryComponent;
  let fixture: ComponentFixture<ReservationsRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsRegistryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationsRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
