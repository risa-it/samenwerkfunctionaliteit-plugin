import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationModule } from 'carbon-components-angular';
import { finalize, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { DocumentInterface } from '../../interface/document.interface';
import { Document } from '../../models/document.model';
import { DocumentService } from '../../service/document.service';
import { SwfDocumentService } from '../../service/swf-document.service';
import { UserNotificationService } from '../../service/user-notification.service';

import { toSignal } from '@angular/core/rxjs-interop';
import { DocumentType } from '@valtimo/document';
import { SwfCaseProperties } from '../../interface/swf-case-properties.interface';
import { SwfPluginService } from '../../service/swf-plugin.service';
import { BusinessKey, toBusinessKey } from '../../types/business-key.type';
import { UploadOptions } from '../../types/upload-options.type';
import { DocumentTableComponent } from './document-table/document-table.component';
import { DocumentTableLightComponent } from './document-table/light/document-table-light.component';

@Component({
  selector: 'document-list',
  templateUrl: './document-list.component.html',
  imports: [
    DocumentTableComponent,
    NotificationModule,
    DocumentTableLightComponent,
  ],
  styleUrl: './document-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent implements OnInit {

  private readonly documentService: DocumentService = inject(DocumentService);
  private readonly swfDocumentService: SwfDocumentService =
    inject(SwfDocumentService);
  readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly swfPluginService = inject(SwfPluginService);
  private readonly notificationService: UserNotificationService = inject(
    UserNotificationService,
  );

  readonly swfPluginProperties = this.swfPluginService.getSwfPluginProperties();

  isLightMode: InputSignal<boolean> = input<boolean>(false);

  documents: WritableSignal<Document[]> = signal<Document[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);

  protected readonly uploadOptions: Signal<UploadOptions> = toSignal(
    this.swfPluginProperties.pipe(
      switchMap((properties) => {
        if (!properties.backupUploadsToDocumentenApi) {
          return of<UploadOptions>({
            uploadToDocumentenApi: false,
          })
        }

        return this.getDocumentUploadTypes().pipe(
          map((documentTypes): UploadOptions => ({
            uploadToDocumentenApi: true,
            documentTypes,
          })
          ),
        );
      }),
    ),
    {
      initialValue: {
        uploadToDocumentenApi: false,
      }
    },
  );

  ngOnInit(): void {
    this.fetchDocumenten();
  }

  protected onDocumentDeleted(documentId: string): void {
    this.documents.update((documents) =>
      documents.filter((document) => {
        return document.documentId !== documentId;
      }),
    );
  }

  protected onDocumentUploaded(): void {
    this.fetchDocumenten();
  }

  private getDocumentUploadTypes(): Observable<DocumentType[]> {
    return this.documentService.getVersionTag(this.businessKey).pipe(
      switchMap((versionTag) =>
        this.documentService.getDocumentTypesForCase(this.caseDefinitionKey, versionTag)
      )
    )
  }

  private get businessKey(): BusinessKey {
    const businessKey = toBusinessKey(
      this.swfDocumentService.getParam(this.route, 'documentId') ?? '',
    );

    if (!businessKey) {
      throw new Error('businessKey is required to fetch document types');
    }

    return businessKey;
  }

  private get caseDefinitionKey(): string {
    const caseDefinitionKey = this.swfDocumentService.getParam(this.route, 'caseDefinitionKey')

    if (!caseDefinitionKey) {
      throw new Error('caseDefinitionKey is required to fetch document types');
    }

    return caseDefinitionKey;
  }

  private fetchDocumenten(): void {
    if (!this.businessKey) {
      this.notificationService.showError({
        titleKey:
          'samenwerkfunctionaliteit.feedback.userNotification.fetchDocuments.failure.title',
      });
      throw new Error(
        'Cannot fetch documenten because the business key is not available.',
      );
    }

    this.swfDocumentService
      .getSamenwerkingProperties(this.businessKey)
      .pipe(
        tap((swfCaseProperties: SwfCaseProperties): void => {
          if (!swfCaseProperties.samenwerkingId) {
            throw new Error(
              'Er is geen documentenlijst beschikbaar, omdat dit dossier niet deel uitmaakt van een samenwerking.',
            );
          }
        }),
        switchMap(
          (
            swfCaseProperties: SwfCaseProperties,
          ): Observable<DocumentInterface[]> => {
            return this.documentService
              .getDocumenten(swfCaseProperties.samenwerkingId)
              .pipe(
                take(1),
                tap((documenten: DocumentInterface[]): void => {
                  this.documents.set(documenten);
                }),
              );
          },
        ),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        error: (error: HttpErrorResponse) => {
          this.notificationService.showError({
            titleKey:
              'samenwerkfunctionaliteit.feedback.userNotification.fetchDocuments.failure.title',
          });
          throw error;
        },
      });
  }
}
