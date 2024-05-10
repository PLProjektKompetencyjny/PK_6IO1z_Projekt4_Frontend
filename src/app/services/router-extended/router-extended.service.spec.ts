import { TestBed } from '@angular/core/testing';

import { RouterExtendedService } from './router-extended.service';

describe('RouterExtendedService', () => {
  let service: RouterExtendedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouterExtendedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
