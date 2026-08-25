import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SAMENWERKINGEN_URL } from '../config/swf-plugin-config';
import { UploadDocumentMetadata } from '../interface/upload-document-metadata.interface';
import { ConfidentialityTypes } from '../types/confidentiality.type';
import { DocumentClient } from './document-client.service';

describe('DocumentClient', () => {
  let service: DocumentClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentClient,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(DocumentClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert a full set of query params to HttpParams', () => {
    const mockQueryParams: UploadDocumentMetadata = {
      documentDescription: 'Mock description',
      numberWithinSystem: '123abc',
      systemId: '456def',
      confidentialityType: ConfidentialityTypes.StrictlyConfidential,
      language: 'English',
    };

    service
      .uploadDocument(new File([], 'test.txt'), 'SAM-12345', mockQueryParams)
      .subscribe();

    const request = httpMock.expectOne(
      (request) =>
        request.method === 'POST' &&
        request.url === `${SAMENWERKINGEN_URL}/SAM-12345/documenten`,
    ).request;

    expect(request.method).toBe('POST');
    expect(request.params.get('documentOmschrijving')).toBe('Mock description');
    expect(request.params.get('nummerBinnenSysteem')).toBe('123abc');
    expect(request.params.get('kenmerkSysteem')).toBe('456def');
    expect(request.params.get('vertrouwelijkheidsAanduiding')).toBe('SV');
    expect(request.params.get('taal')).toBe('English');
  });

  it('should convert a partial set of query params to HttpParams', () => {
    const mockQueryParams: UploadDocumentMetadata = {
      documentDescription: 'Partial set of params here!',
      confidentialityType: ConfidentialityTypes.Confidential,
    };

    service
      .uploadDocument(new File([], 'test.txt'), 'SAM-67890', mockQueryParams)
      .subscribe();

    const request = httpMock.expectOne(
      (request) =>
        request.method === 'POST' &&
        request.url === `${SAMENWERKINGEN_URL}/SAM-67890/documenten`,
    ).request;

    expect(request.method).toBe('POST');
    expect(request.params.get('documentOmschrijving')).toBe(
      'Partial set of params here!',
    );
    expect(request.params.get('nummerBinnenSysteem')).toBeNull();
    expect(request.params.get('kenmerkSysteem')).toBeNull();
    expect(request.params.get('vertrouwelijkheidsAanduiding')).toBe('RV');
    expect(request.params.get('taal')).toBeNull();
  });
});
