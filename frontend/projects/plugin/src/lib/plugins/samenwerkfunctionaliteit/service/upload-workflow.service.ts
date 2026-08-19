import { inject, Injectable } from '@angular/core';
import { DocumentService as ValtimoDocumentService } from '@valtimo/document';
import { NGXLogger } from 'ngx-logger';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { NoLinkedUploadProcessError } from '../errors/no-link-upload-process.error';
import { UploadDocumentMetadata } from '../interface/upload-document-metadata.interface';
import { UserNotification } from '../interface/user-notification.interface';
import { BusinessKey } from '../types/business-key.type';
import { ConfidentialityTypes } from '../types/confidentiality.type';
import { DocumentService } from './document.service';
import { SwfPluginService } from './swf-plugin.service';
import { UserNotificationService } from './user-notification.service';

@Injectable({
  providedIn: 'root',
})
export class UploadWorkFlowService {
  private readonly documentService = inject(DocumentService);
  private readonly swfPluginService: SwfPluginService =
    inject(SwfPluginService);
  private readonly notificationService: UserNotificationService = inject(
    UserNotificationService,
  );
  private readonly valtimoDocumentService: ValtimoDocumentService = inject(
    ValtimoDocumentService,
  );
  private readonly logger: NGXLogger = inject(NGXLogger);

  private caseDefinitionVersionTag?: string;

  startUpload(
    file: File,
    samenwerkingId: string,
    businessKey: BusinessKey,
    caseDefinitionKey: string,
    metadata: UploadDocumentMetadata,
  ): Observable<void> {
    // TODO: replace with call to modal service to collect data from user. For now: return some mock data to test;
    return forkJoin({
      versionTag: this.getVersionTag(businessKey),
      metadata: of<UploadDocumentMetadata>(metadata),
      config: this.swfPluginService.getSwfPluginProperties(),
    }).pipe(
      map(({ versionTag, metadata, config }) => {
        return {
          context: {
            file,
            samenwerkingId,
            businessKey,
            caseDefinitionKey,
            caseDefinitionVersionTag: versionTag,
          },
          metadata,
          config,
        };
      }),

      switchMap(({ context, metadata, config }) => {
        if (!config.backupUploadsToDocumentenApi) {
          this.logger.debug(
            'Skipping backup upload to Documenten API as per configuration',
          );
          return of({ context, metadata });
        }
        this.logger.debug('Uploading with mock metadata:', metadata);

        return this.documentService
          .uploadDocumentToDocumentenAPI(context, metadata)
          .pipe(
            tap(() => {
              const notification: UserNotification = {
                titleKey:
                  'samenwerkfunctionaliteit.feedback.userNotification.uploadDocumentToDocumentenApi.success.title',
                messageKey:
                  'samenwerkfunctionaliteit.feedback.userNotification.uploadDocumentToDocumentenApi.success.message',
                messageParam: { filename: context.file.name },
              };

              this.notificationService.showSuccess(notification);
            }),

            map((reference) => ({
              context,
              metadata: {
                ...metadata,
                systemId: reference.id,
              },
            })),

            catchError((error: Error) => {
              if (error instanceof NoLinkedUploadProcessError) {
                this.notificationService.showError({
                  titleKey:
                    'samenwerkfunctionaliteit.feedback.userNotification.uploadDocumentToSWF.failure.title',
                });
              } else {
                this.notificationService.showError({
                  titleKey:
                    'samenwerkfunctionaliteit.feedback.userNotification.uploadDocumentToDocumentenApi.failure.title',
                });
              }
              return of({ context, metadata });
            }),
          );
      }),

      switchMap(({ context, metadata }) =>
        this.documentService.uploadDocumentToSWF(context, metadata).pipe(
          tap(() => {
            const notification: UserNotification = {
              titleKey:
                'samenwerkfunctionaliteit.feedback.userNotification.uploadDocumentToSWF.success.title',
              messageKey:
                'samenwerkfunctionaliteit.feedback.userNotification.uploadDocumentToSWF.success.message',
              messageParam: { filename: context.file.name },
            };

            this.notificationService.showSuccess(notification);
          }),

          catchError(() => {
            this.notificationService.showError({
              titleKey:
                'samenwerkfunctionaliteit.feedback.userNotification.uploadDocumentToSWF.failure.title',
            });
            return of(undefined);
          }),
        ),
      ),
    );
  }

  private getVersionTag(businessKey: BusinessKey): Observable<string> {
    if (this.caseDefinitionVersionTag) {
      return of(this.caseDefinitionVersionTag);
    }

    if (!businessKey) {
      throw new Error(
        'Cannot get case definition version tag because the business key is not available.',
      );
    }

    return this.getCaseDefinitionVersionTag(businessKey);
  }

  private getCaseDefinitionVersionTag(
    businessKey: BusinessKey,
  ): Observable<string> {
    return this.valtimoDocumentService.getDocument(businessKey.toString()).pipe(
      take(1),
      map((document) => {
        const versionTag =
          document.definitionId?.blueprintId.blueprintVersionTag;

        if (!versionTag) {
          throw new Error(
            `No version tag was found for ${document.definitionName}`,
          );
        }

        return versionTag;
      }),
    );
  }

  mockModalData = {
    documentDescription: 'Test document',
    numberWithinSystem: '12345',
    systemId: 'ACME_EU_WEST',
    confidentialityType: ConfidentialityTypes.StrictlyConfidential,
    language: 'Nederlands',
  };
}
