/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { UserAuthService } from './user-auth.service';
import { MsalService } from '@azure/msal-angular';

describe('Service: UserAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAuthService, MsalService]
    });
  });

  it('should ...', inject([UserAuthService], (service: UserAuthService) => {
    expect(service).toBeTruthy();
  }));
});
