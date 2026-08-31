import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActieverzoekClient } from './actieverzoek.client';

describe('ActieverzoekClientService', () => {
  let service: ActieverzoekClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(ActieverzoekClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
