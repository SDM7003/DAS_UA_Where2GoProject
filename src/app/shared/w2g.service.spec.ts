import { TestBed } from '@angular/core/testing';

import { W2gService } from './w2g.service';

describe('W2gService', () => {
  let service: W2gService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(W2gService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
