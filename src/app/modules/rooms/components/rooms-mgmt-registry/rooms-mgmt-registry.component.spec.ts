import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsMgmtRegistryComponent } from './rooms-mgmt-registry.component';

describe('RoomsMgmtRegistryComponent', () => {
  let component: RoomsMgmtRegistryComponent;
  let fixture: ComponentFixture<RoomsMgmtRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsMgmtRegistryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RoomsMgmtRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
