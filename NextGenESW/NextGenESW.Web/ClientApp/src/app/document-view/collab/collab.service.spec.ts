import { SharedModule } from './../../shared/shared.module';
import { TestBed } from '@angular/core/testing';
import { CollabService } from './collab.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('CollabService', () => {
  let service: CollabService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, SharedModule],
      providers:[CollabService]
    });
    service = TestBed.inject(CollabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
