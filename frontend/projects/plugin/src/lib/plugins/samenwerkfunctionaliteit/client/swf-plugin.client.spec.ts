import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SwfPluginClient } from './swf-plugin.client';

describe('SwfPluginClient', () => {
  let service: SwfPluginClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwfPluginClient, { provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(SwfPluginClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
