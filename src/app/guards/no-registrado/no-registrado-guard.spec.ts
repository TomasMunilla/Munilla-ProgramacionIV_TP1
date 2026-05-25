import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noRegistradoGuard } from './no-registrado-guard';

describe('noRegistradoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => noRegistradoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
