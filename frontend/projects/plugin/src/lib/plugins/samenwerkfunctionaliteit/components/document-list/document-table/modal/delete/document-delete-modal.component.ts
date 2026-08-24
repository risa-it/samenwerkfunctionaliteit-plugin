import { Component, inject, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'carbon-components-angular';

import {
  ModalService,
  VModalComponent,
  VModalModule,
} from '@valtimo/components';
import { Document } from '../../../../../models/document.model';

@Component({
  selector: 'document-delete-modal',
  standalone: true,
  imports: [ButtonModule, TranslatePipe, VModalModule],
  templateUrl: './document-delete-modal.component.html',
  styleUrl: './document-delete-modal.component.scss',
})
export class DocumentDeleteModal {
  private readonly modalService = inject(ModalService);

  readonly modal = viewChild.required<VModalComponent>('deleteModal');

  readonly document = input<Document>();

  readonly deleted = output<void>();
  readonly cancelled = output<void>();

  protected delete(): void {
    this.deleted.emit();
    this.modalService.closeModal();
  }

  protected cancel(): void {
    this.modalService.closeModal(() => {
      this.cancelled.emit();
    });
  }
}
