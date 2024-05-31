import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsRegistryComponent } from './rooms-registry.component';

describe('RoomsRegistryComponent', () => {
  let component: RoomsRegistryComponent;
  let fixture: ComponentFixture<RoomsRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsRegistryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomsRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
