import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SwfPluginClient } from '../client/swf-plugin.client';
import { SwfPluginService } from './swf-plugin.service';

describe('SwfPluginService', () => {
  let service: SwfPluginService;
  let swfPluginClient: jasmine.SpyObj<SwfPluginClient>;

  beforeEach(() => {

    swfPluginClient = jasmine.createSpyObj('swfPluginClient', ['getSwfPluginProperties'])

    TestBed.configureTestingModule({
      providers: [SwfPluginService, { provide: SwfPluginClient, useValue: swfPluginClient }],
    });
    service = TestBed.inject(SwfPluginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the plugin properties', () => {
    const mockPropertiesResponse = {
      baseUrl: 'https://example.com',
      oinNummer: '00000001234567800000',
      backupUploadsToDocumentenApi: true
    }

    const expectedProperties = {
      baseUrl: 'https://example.com',
      oinNummer: '00000001234567800000',
      backupUploadsToDocumentenApi: true
    }

    swfPluginClient.getSwfPluginProperties.and.returnValue(of(mockPropertiesResponse));

    service.getSwfPluginProperties().subscribe((properties) => {
      expect(properties).toEqual(expectedProperties);
    })
  })

  it('should call the client for a first call, and then return cached properties for subsequent calls', () => {
    const mockPropertiesResponse = {
      baseUrl: 'https://example.com',
      oinNummer: '00000001234567800000',
      backupUploadsToDocumentenApi: true
    }
    const expectedProperties = {
      baseUrl: 'https://example.com',
      oinNummer: '00000001234567800000',
      backupUploadsToDocumentenApi: true
    }

    swfPluginClient.getSwfPluginProperties.and.returnValue(of(mockPropertiesResponse));

    service.getSwfPluginProperties().subscribe((properties) => {
      expect(properties).toEqual(expectedProperties);
    })
    service.getSwfPluginProperties().subscribe((properties) => {
      expect(properties).toEqual(expectedProperties);
    })

    expect(swfPluginClient.getSwfPluginProperties).toHaveBeenCalledTimes(1)
  })
});
