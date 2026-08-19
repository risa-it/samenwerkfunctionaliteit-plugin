import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  AlertModalData,
  ButtonModule,
  IconModule,
  PaginationModule,
  PlaceholderModule,
  TableHeaderItem,
  TableItem,
  TableModel,
  TableModule,
} from 'carbon-components-angular';
import { catchError, of } from 'rxjs';
import { Document } from '../../../models/document.model';
import { DocumentService } from '../../../service/document.service';
import { UserNotificationService } from '../../../service/user-notification.service';
import { getPaginationTranslations } from '../../../shared/carbon/pagination-translations';
import { documentTableDeleteModalConfig } from '../config/document-table-modal-config';
import { DocumentTableModal } from '../modal/document-table-modal';

@Component({
  selector: 'document-table',
  imports: [
    TableModule,
    ReactiveFormsModule,
    PaginationModule,
    NgIf,
    ButtonModule,
    IconModule,
    PlaceholderModule,
    TranslatePipe,
    DocumentTableModal,
  ],
  templateUrl: './document-table.component.html',
  styleUrl: './document-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTableComponent implements OnInit {
  private readonly translateService: TranslateService =
    inject(TranslateService);
  private readonly documentService: DocumentService = inject(DocumentService);
  private readonly notificationService: UserNotificationService = inject(
    UserNotificationService,
  );

  documents: InputSignal<Document[]> = input<Document[]>([]);
  deleted = output<string>();
  uploaded = output<void>();

  searchValue: WritableSignal<string> = signal('');

  readonly filteredDocuments = computed(() => {
    const search = this.searchValue().trim().toLowerCase();

    if (!search) {
      return this.documents();
    }

    return this.documents().filter((document) =>
      document.filename.toLowerCase().includes(search),
    );
  });

  displayedDocuments: WritableSignal<Document[]> = signal([]);

  selectedDocument: WritableSignal<Document | undefined> = signal(undefined);
  isSkeleton: InputSignal<boolean> = input<boolean>(true);
  model: WritableSignal<TableModel> = signal(new TableModel());
  isUploading: WritableSignal<boolean> = signal(false);
  searchValue: WritableSignal<string> = signal('');

  private readonly documentTableModal =
    viewChild.required<DocumentTableModal>('documentTableModal');

  private businessKey?: BusinessKey;
  private caseDefinitionKey?: string;

  protected readonly deleteConfig: AlertModalData =
    documentTableDeleteModalConfig;

  protected searchFieldPlaceholder: string = this.translateService.instant(
    'samenwerkfunctionaliteit.common.actions.search',
  );

  striped: boolean = false;
  enableSingleSelect: boolean = true;
  showSelectionColumn: boolean = false;

  private readonly documentsEffect = effect(() => {
    const documents = this.filteredDocuments();

    this.setTableModel(documents);
    this.selectPage(1);
  });

  ngOnInit(): void {
    this.businessKey = toBusinessKey(
      this.swfDocumentService.getParam(this.route, 'documentId') ?? '',
    );

    this.caseDefinitionKey =
      this.swfDocumentService.getParam(this.route, 'caseDefinitionKey') ?? '';
  }

  protected selectPage(page: number): void {
    const documentsPage = this.getDocumentsForPage(page);

    this.displayedDocuments.set(documentsPage);

    this.model.update((model: TableModel): TableModel => {
      model.data = this.getTableItems(documentsPage);
      model.currentPage = page;
      return model;
    });
  }

  protected onRowSelected(event: {
    model: TableModel;
    selectedRowIndex: number;
  }): void {
    this.selectedDocument.set(
      this.displayedDocuments()[event.selectedRowIndex],
    );
    console.log(this.selectedDocument()?.documentId);
  }

  protected downloadDocument(): void {
    const documentId = this.selectedDocument()?.documentId;
    if (!documentId) {
      return;
    }

    this.documentService
      .downloadDocument(documentId)
      .pipe(
        tap(() => {
          this.hideToolbar();
        }),
        catchError(() => {
          this.notificationService.showError({
            titleKey:
              'samenwerkfunctionaliteit.feedback.userNotification.downloadDocument.failure.title',
          });
          return of(undefined);
        }),
      )
      .subscribe();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const businessKey = this.businessKey;
    const caseDefinitionKey = this.caseDefinitionKey;

    if (!businessKey || !caseDefinitionKey) {
      return;
    }

    this.isUploading.set(true);

    this.documentModalService
      .openUploadMetadata(this.uploadMetadataModal())
      .pipe(
        switchMap((metadata) =>
          this.swfDocumentService
            .getSamenwerkingProperties(businessKey)
            .pipe(
              switchMap((samenwerkingProps) =>
                this.uploadWorkFlowService.startUpload(
                  file,
                  samenwerkingProps.samenwerkingId,
                  businessKey,
                  caseDefinitionKey,
                  metadata,
                ),
              ),
            ),
        ),

        tap(() => {
          this.uploaded.emit();
        }),
        finalize(() => {
      this.isUploading.set(false);
        }),
      )
      .subscribe();
  }

  protected deleteDocument(): void {
    const document = this.selectedDocument();
    if (!document?.documentId) {
      return;
    }

    this.documentModalService
      .openDelete(this.deleteDocumentModal())
      .pipe(
        switchMap(() => {
          return this.documentService.deleteDocument(document.documentId).pipe(
            tap(() => {
              const notification: UserNotification = {
                titleKey:
                  'samenwerkfunctionaliteit.feedback.userNotification.deleteDocument.success.title',
                messageKey:
                  'samenwerkfunctionaliteit.feedback.userNotification.deleteDocument.success.message',
                messageParam: { filename: document.filename },
              };

              this.notificationService.showSuccess(notification);

              this.hideToolbar();

              this.deleted.emit(document.documentId);
            }),
            catchError(() => {
              this.notificationService.showError({
                titleKey:
                  'samenwerkfunctionaliteit.feedback.userNotification.deleteDocument.failure.title',
              });
              return of(undefined);
            }),
          );
        }),
      )
      .subscribe();
  }

  protected filterFileNames(fileName: string) {
    this.searchValue.set(fileName);
  }

  protected get batchText(): { SINGLE: string; MULTIPLE: string } {
    return {
      SINGLE: this.translateService.instant(
        'samenwerkfunctionaliteit.documentTable.selectedFile',
        this.selectedDocument()?.filename
          ? { filename: this.selectedDocument()?.filename }
          : undefined,
      ),
      MULTIPLE: '',
    };
  }

  protected readonly paginationTranslations = getPaginationTranslations(
    this.translateService,
    'document',
    'documenten',
  );

  private hideToolbar(): void {
    this.selectedDocument.set(undefined);
    this.model().selectAll(false);
  }

  private getDocumentsForPage(page: number): Document[] {
    const documents = this.filteredDocuments();

    const startIndex = (page - 1) * this.model().pageLength;
    const endIndex = Math.min(
      startIndex + this.model().pageLength,
      documents.length,
    );

    return documents.slice(startIndex, endIndex);
  }

  private getTableItems(documents: Document[]): TableItem[][] {
    return documents.map((document) => [
      new TableItem({ data: document.filename }),
      new TableItem({
        data: this.translateService.instant(
          confidentialityTypeToTranslationKey(document.confidentialityType),
        ),
      }),
      new TableItem({
        data: new Date(document.creationDate).toLocaleDateString(),
      }),
    ]);
  }

  private setTableModel(documents: Document[]): void {
    this.model.update((model: TableModel): TableModel => {
      model.totalDataLength = documents.length;
      model.header = this.createTableHeadersForTableModel();

      return model;
    });
  }

  private createTableHeadersForTableModel(): TableHeaderItem[] {
    return [
      new TableHeaderItem({
        data: this.translateService.instant(
          'samenwerkfunctionaliteit.documentTable.fileName',
        ),
      }),
      new TableHeaderItem({
        data: this.translateService.instant(
          'samenwerkfunctionaliteit.documentTable.confidentialityType',
        ),
      }),
      new TableHeaderItem({
        data: this.translateService.instant(
          'samenwerkfunctionaliteit.documentTable.dateCreated',
        ),
      }),
    ];
  }
}
