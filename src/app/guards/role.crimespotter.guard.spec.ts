import { TestBed } from '@angular/core/testing';

import { RoleCrimespotterGuard } from './role.crimespotter.guard';

describe('RoleCrimespotterGuard', () => {
  let guard: RoleCrimespotterGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleCrimespotterGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
