import { TestBed } from '@angular/core/testing';
import { UploadProviderService } from '@valtimo/resource';
import { DocumentenApiLinkProcessService } from '@valtimo/zgw';
import { NGXLogger } from 'ngx-logger';
import { DocumentClient } from '../client/document-client.service';
import { DocumentService } from './document.service';
import { FileDownloadService } from './file-download.service';

describe('DocumentService', () => {
  let service: DocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentService,
        { provide: DocumentClient, useValue: {} },
        { provide: FileDownloadService, useValue: {} },
        { provide: DocumentenApiLinkProcessService, useValue: {} },
        { provide: UploadProviderService, useValue: {} },
        { provide: NGXLogger, useValue: {} },
      ],
    });
    service = TestBed.inject(DocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
