import { TestBed } from '@angular/core/testing';

import { UserAuth } from './user-auth';

describe('UserAuth', () => {
  let service: UserAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
