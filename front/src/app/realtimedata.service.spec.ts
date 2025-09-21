import { TestBed } from '@angular/core/testing';

import { RealtimedataService } from './realtimedata.service';

describe('RealtimedataService', () => {
  let service: RealtimedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
