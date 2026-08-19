import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationModule } from 'carbon-components-angular';
import { finalize, Observable, switchMap, take, tap } from 'rxjs';
import { DocumentInterface } from '../../interface/document.interface';
import { Document } from '../../models/document.model';
import { SamenwerkingProperties } from '../../models/samenwerking-properties.model';
import { DocumentService } from '../../service/document.service';
import { SwfDocumentService } from '../../service/swf-document.service';
import { UserNotificationService } from '../../service/user-notification.service';

import { BusinessKey, toBusinessKey } from '../../types/business-key.type';
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
  private readonly notificationService: UserNotificationService = inject(
    UserNotificationService,
  );

  private businessKey?: BusinessKey;

  isLightMode: InputSignal<boolean> = input<boolean>(false);

  documents: WritableSignal<Document[]> = signal<Document[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);

  ngOnInit(): void {
    this.businessKey = toBusinessKey(
      this.swfDocumentService.getParam(this.route, 'documentId') ?? '',
    );

    this.fetchDocumenten();
  }

  protected onDocumentDeleted(documentId: UUID): void {
    this.documents.update((documents) =>
      documents.filter((document) => {
        return document.documentId !== documentId;
      }),
    );
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
        take(1),
        tap((samenwerkingProperties: SamenwerkingProperties): void => {
          if (!samenwerkingProperties.samenwerkingId) {
            throw new Error(
              'Er is geen documentenlijst beschikbaar, omdat dit dossier niet deel uitmaakt van een samenwerking.',
            );
          }
        }),
        switchMap(
          (
            samenwerkingProperties: SamenwerkingProperties,
          ): Observable<DocumentInterface[]> => {
            return this.documentService
              .getDocumenten(samenwerkingProperties.samenwerkingId)
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
