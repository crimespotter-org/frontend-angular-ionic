import { TestBed } from '@angular/core/testing';

import { EditCaseService } from './edit-case.service';

describe('EditCaseService', () => {
  let service: EditCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
