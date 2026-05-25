import { TestBed } from '@angular/core/testing';

import { MayormenorService } from './mayormenor-service';

describe('MayormenorService', () => {
  let service: MayormenorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MayormenorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
