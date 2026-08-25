import { Component, inject, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  ButtonModule,
  DropdownModule,
  IconModule,
  IconService,
  InputModule,
  TooltipModule,
} from 'carbon-components-angular';

import { Information32, Upload32 } from '@carbon/icons';
import {
  ModalService,
  VModalComponent,
  VModalModule,
} from '@valtimo/components';
import { UploadDocumentMetadata } from '../../../../../interface/upload-document-metadata.interface';
import {
  ConfidentialityType,
  ConfidentialityTypes,
} from '../../../../../types/confidentiality.type';

@Component({
  selector: 'document-upload-metadata-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputModule,
    DropdownModule,
    ButtonModule,
    TranslatePipe,
    VModalModule,
    IconModule,
    TooltipModule,
  ],
  templateUrl: './document-upload-metadata-modal.component.html',
  styleUrl: './document-upload-metadata-modal.component.scss',
})
export class DocumentUploadMetadataModal {
  private readonly modalService = inject(ModalService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly translateService = inject(TranslateService);
  private readonly iconService = inject(IconService);

  readonly modal = viewChild.required<VModalComponent>('uploadModal');

  readonly submitted = output<UploadDocumentMetadata>();
  readonly cancelled = output<void>();

  protected readonly metadataForm = this.formBuilder.group({
    documentDescription: [''],
    numberWithinSystem: [''],
    confidentialityType: [
      ConfidentialityTypes.Confidential as ConfidentialityType,
      Validators.required,
    ],
  });

  protected confidentialityOptionsLabel = this.translateService.instant(
    'samenwerkfunctionaliteit.types.document.confidentialityType',
  );

  protected confidentialityTypeTooltipText = this.translateService.instant(
    'samenwerkfunctionaliteit.documentTable.documentUploadModal.confidentialityTypeTooltip',
  );

  protected confidentialityOptions = [
    {
      content: this.translateService.instant(
        'samenwerkfunctionaliteit.types.confidentiality.confidential',
      ),
      id: ConfidentialityTypes.Confidential,
      selected: false,
    },
    {
      content: this.translateService.instant(
        'samenwerkfunctionaliteit.types.confidentiality.strictlyConfidential',
      ),
      id: ConfidentialityTypes.StrictlyConfidential,
      selected: false,
    },
  ];

  ngOnInit() {
    this.iconService.registerAll([Information32, Upload32]);
  }

  protected submit(): void {
    this.submitted.emit({
      documentDescription:
        this.metadataForm.controls.documentDescription.value || undefined,
      numberWithinSystem:
        this.metadataForm.controls.numberWithinSystem.value || undefined,
      confidentialityType:
        this.metadataForm.controls.confidentialityType.value || undefined,
      systemId: this.metadataForm.controls.systemId.value || undefined,
    });
  }

  protected cancel(): void {
    this.modalService.closeModal(() => {
      this.cancelled.emit();
    });
  }
}
