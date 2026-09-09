import { inject, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError
} from 'rxjs';
import { NoLinkedUploadProcessError } from '../errors/no-link-upload-process.error';
import { UploadContext } from '../interface/upload-context.interface';
import { UploadMetadata } from '../interface/upload-document-metadata.interface';
import { UserNotification } from '../interface/user-notification.interface';
import { BusinessKey } from '../types/business-key.type';
import { DocumentService } from './document.service';
import { SwfDocumentService } from './swf-document.service';
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
  private readonly swfDocumentService: SwfDocumentService =
    inject(SwfDocumentService);
  private readonly logger: NGXLogger = inject(NGXLogger);


  upload(
    file: File,
    businessKey: BusinessKey,
    caseDefinitionKey: string,
    metadata: UploadMetadata,
  ): Observable<void> {
    return forkJoin({
      versionTag: this.documentService.getVersionTag(businessKey),
      samenwerkingProps:
        this.swfDocumentService.getSamenwerkingProperties(businessKey),
      metadata: of<UploadMetadata>(metadata),
    }).pipe(
      map(({ versionTag, samenwerkingProps, metadata }) => {
        const context: UploadContext = {
          file,
          samenwerkingId: samenwerkingProps.samenwerkingId,
          businessKey,
          caseDefinitionKey,
          caseDefinitionVersionTag: versionTag,
        };

        return {
          context,
          metadata,
        };
      }),

      switchMap(({ context, metadata }) => {
        if (!metadata.uploadToDocumentenApi) {
          this.logger.debug(
            'Skipping backup upload to Documenten API as per configuration',
          );
          return of({ context, metadata });
        }
        this.logger.debug('Uploading with metadata:', metadata);

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
                    'samenwerkfunctionaliteit.feedback.userNotification.uploadDocumentToDocumentenApi.failure.title',
                  messageKey:
                    'samenwerkfunctionaliteit.feedback.userNotification.uploadDocumentToDocumentenApi.NoLinkedUploadProcessFailure.message',
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

          catchError((error) => {
            this.notificationService.showError({
              titleKey:
                'samenwerkfunctionaliteit.feedback.userNotification.uploadDocumentToSWF.failure.title',
            });
            return throwError(() => error);
          }),
        ),
      ),
    );
  }


}
