import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ModalService } from '@valtimo/components';

import { DocumentDeleteModal } from '../components/document-list/document-table/modal/delete/document-delete-modal.component';
import { DocumentUploadMetadataModal } from '../components/document-list/document-table/modal/upload/document-upload-metadata-modal.component';
import { UploadDocumentMetadata } from '../interface/upload-document-metadata.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentModalService {
  constructor(private readonly modalService: ModalService) {}

  openUploadMetadata(
    modal: DocumentUploadMetadataModal,
  ): Observable<UploadDocumentMetadata> {
    return new Observable((subscriber) => {
      const submittedSubscription = modal.submitted.subscribe((metadata) => {
        subscriber.next(metadata);
        subscriber.complete();
      });

      const closeSubscription = modal.modal().closeEvent.subscribe(() => {
        subscriber.complete();
      });

      const cancelledSubscription = modal.cancelled.subscribe(() => {
        subscriber.complete();
      });

      this.modalService.openModal(modal.modal());

      return () => {
        submittedSubscription.unsubscribe();
        closeSubscription.unsubscribe();
        cancelledSubscription.unsubscribe();
      };
    });
  }

  openDelete(modal: DocumentDeleteModal): Observable<void> {
    return new Observable((subscriber) => {
      const deletedSubscription = modal.deleted.subscribe(() => {
        subscriber.next();
        subscriber.complete();
      });

      const closeSubscription = modal.modal().closeEvent.subscribe(() => {
        subscriber.complete();
      });

      const cancelledSubscription = modal.cancelled.subscribe(() => {
        subscriber.complete();
      });

      this.modalService.openModal(modal.modal());

      return () => {
        deletedSubscription.unsubscribe();
        closeSubscription.unsubscribe();
        cancelledSubscription.unsubscribe();
      };
    });
  }
}
