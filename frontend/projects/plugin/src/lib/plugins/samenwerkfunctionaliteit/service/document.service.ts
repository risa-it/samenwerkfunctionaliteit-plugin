import { inject, Injectable } from '@angular/core';
import { DocumentenApiLinkProcessService } from '@valtimo/zgw';
import { catchError, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';

import { DocumentType, DocumentService as ValtimoDocumentService } from '@valtimo/document';
import {
  DocumentenApiFileReference,
  UploadProviderService,
} from '@valtimo/resource';
import { NGXLogger } from 'ngx-logger';
import { DocumentClient } from '../client/document.client';
import {
  DocumentenOverzichtResponse,
  mapDocumentenResponseToModels,
} from '../dto/document.dto';
import { NoDocumentTypesFoundError } from '../errors/no-document-types.error';
import { NoLinkedUploadProcessError } from '../errors/no-link-upload-process.error';
import { DocumentInterface } from '../interface/document.interface';
import { FileDownload } from '../interface/file-download.interface';
import { UploadContext } from '../interface/upload-context.interface';
import { UploadDocumentToDocumentenApiMetadata, UploadMetadata } from '../interface/upload-document-metadata.interface';
import { BusinessKey } from '../types/business-key.type';
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
  private readonly valtimoDocumentService = inject(ValtimoDocumentService);
  private readonly logger: NGXLogger = inject(NGXLogger);

  private caseDefinitionVersionTag?: string;

  getDocumenten(samenwerkingId: string): Observable<DocumentInterface[]> {
    return this.documentClient.getDocumenten(samenwerkingId).pipe(
      map((documentenOverzichtResponse: DocumentenOverzichtResponse) => {
        return mapDocumentenResponseToModels(documentenOverzichtResponse);
      }),
      catchError((error: Error) => {
        return throwError(() => error);
      }),
    );
  }

  uploadDocumentToDocumentenAPI(
    context: UploadContext,
    metadata: UploadDocumentToDocumentenApiMetadata,
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
            creatieDatum: new Date().toISOString().split('T')[0],
            informatieobjecttype: metadata.documentType.url,
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
    metadata: UploadMetadata,
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

  getDocumentTypesForCase(
    caseDefinitionKey: string,
    versionTag: string
  ): Observable<DocumentType[]> {
    return this.valtimoDocumentService.getDocumentTypesForCase(caseDefinitionKey, versionTag).pipe(
      map(documentTypes => {
        if (documentTypes.length === 0) {
          throw new NoDocumentTypesFoundError(caseDefinitionKey, versionTag);
        }
        return documentTypes;
      })
    );
  }

  getVersionTag(businessKey: BusinessKey): Observable<string> {
    if (this.caseDefinitionVersionTag) {
      return of(this.caseDefinitionVersionTag);
    }

    if (!businessKey) {
      throw new Error(
        'Cannot get case definition version tag because the business key is not available.',
      );
    }

    return this.valtimoDocumentService.getDocument(businessKey.toString()).pipe(
      take(1),
      map((document) => {
        const versionTag = document.definitionId?.blueprintId.blueprintVersionTag;

        if (!versionTag) {
          throw new Error(
            `No version tag was found for ${document.definitionName}`,
          );
        }

        return versionTag;
      }),
    );
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
            throw new NoLinkedUploadProcessError(
              context.caseDefinitionKey,
              context.caseDefinitionVersionTag,
            );
          }

          this.logger.debug('Found Documenten API process link: ', processLink);
        }),
        map(() => undefined),
      );
  }
}
