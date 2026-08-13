import { inject, Injectable } from '@angular/core';
import { DocumentenApiLinkProcessService } from '@valtimo/zgw';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

import {
  DocumentenApiFileReference,
  UploadProviderService,
} from '@valtimo/resource';
import { NGXLogger } from 'ngx-logger';
import { DocumentClient } from '../client/document-client.service';
import {
  DocumentenOverzichtResponse,
  mapDocumentenResponseToModels,
} from '../dto/document.dto';
import { NoLinkedUploadProcessError } from '../errors/no-link-upload-process.error';
import { DocumentInterface } from '../interface/document.interface';
import { FileDownload } from '../interface/file-download.interface';
import { UploadContext } from '../interface/upload-context.interface';
import { UploadDocumentMetadata } from '../interface/upload-document-metadata.interface';
import { ConfidentialityTypes } from '../types/confidentiality.type';
import { UUID } from '../types/uuid.type';
import { FileDownloadService } from './file-download.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly documentClient: DocumentClient = inject(DocumentClient);
  private readonly downloader: FileDownloadService =
    inject(FileDownloadService);
  private readonly documentenApiLinkProcessService: DocumentenApiLinkProcessService =
    inject(DocumentenApiLinkProcessService);
  private readonly uploadProviderService: UploadProviderService = inject(
    UploadProviderService,
  );

  private readonly logger: NGXLogger = inject(NGXLogger);

  getDocumenten(samenwerkingId: string): Observable<DocumentInterface[]> {
    return this.documentClient.getDocumenten(samenwerkingId).pipe(
      map((documentenOverzichtResponse: DocumentenOverzichtResponse) => {
        return mapDocumentenResponseToModels(documentenOverzichtResponse);
      }),
      map((documenten: DocumentInterface[]) => {
        return documenten;
      }),
      catchError((error: Error) => {
        return throwError(() => error);
      }),
    );
  }

  uploadDocumentToDocumentenAPI(
    context: UploadContext,
    metadata: UploadDocumentMetadata,
  ): Observable<DocumentenApiFileReference> {
    this.logger.debug('Uploading to Documenten API...');

    // Can be removed after validation in test
    this.logger.debug('context:', context, 'metadata', metadata);

    return this.verifyLinkedUploadProcess(context).pipe(
      switchMap(() => {
        return this.uploadProviderService
          .uploadTempFileWithMetadata(context.file, {
            documentId: context.businessKey,
            bestandsnaam: context.file.name,
            titel: context.file.name,
            auteur: 'Samenwerkfunctionaliteit-plugin',
            taal: 'nld',
            vertrouwelijkheidaanduiding:
              // Note: mapping confidentiality types between Dutch and English is not straightforward, so we use a simple mapping here.
              metadata.confidentialityType === ConfidentialityTypes.Confidential
                ? 'vertrouwelijk'
                : 'confidentieel',
            creatieDatum: new Date().toISOString().split('T')[0],
          })

          .pipe(
            tap((reference) => {
              this.logger.debug(
                `Successfully uploaded file to Documenten API — reference ID: ${reference.id}`,
              );
            }),
          );
      }),
    );
  }

  uploadDocumentToSWF(
    context: UploadContext,
    metadata?: UploadDocumentMetadata,
  ): Observable<void> {
    this.logger.debug('Uploading to Samenwerkfunctionaliteit-API...');
    return this.documentClient
      .uploadDocument(context.file, context.samenwerkingId, metadata)

      .pipe(
        tap(() =>
          this.logger.info(
            `Successfully uploaded ${context.file.name} to Samenwerkfunctionaliteit API`,
          ),
        ),
      );
  }

  deleteDocument(documentId: UUID): Observable<void> {
    return this.documentClient.deleteDocument(documentId);
  }

  downloadDocument(documentId: UUID): Observable<FileDownload> {
    return this.documentClient
      .downloadDocument(documentId)
      .pipe(tap((file) => this.downloader.download(file)));
  }

  private verifyLinkedUploadProcess(context: UploadContext): Observable<void> {
    return this.documentenApiLinkProcessService
      .getLinkedUploadProcess(
        context.caseDefinitionKey,
        context.caseDefinitionVersionTag,
      )

      .pipe(
        tap((processLink) => {
          if (!processLink) {
            return throwError(
              () =>
                new NoLinkedUploadProcessError(
                  context.caseDefinitionKey,
                  context.caseDefinitionVersionTag,
                ),
            );
          }

          this.logger.debug('Found Documenten API process link: ', processLink);
        }),
        map(() => undefined),
      );
  }
}
