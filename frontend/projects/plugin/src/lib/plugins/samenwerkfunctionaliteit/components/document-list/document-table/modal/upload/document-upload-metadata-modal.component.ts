import { Component, effect, inject, input, InputSignal, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  ButtonModule,
  DropdownModule,
  IconModule,
  IconService,
  InputModule,
  LoadingModule,
  TooltipModule,
} from 'carbon-components-angular';

import { ActivatedRoute } from '@angular/router';
import { Information32, Upload32 } from '@carbon/icons';
import {
  ModalService,
  VModalComponent,
  VModalModule,
} from '@valtimo/components';
import { DocumentType } from '@valtimo/document';
import { UploadDocumentMetadata, UploadDocumentToDocumentenApiMetadata } from '../../../../../interface/upload-document-metadata.interface';
import { DocumentService } from '../../../../../service/document.service';
import { SwfDocumentService } from '../../../../../service/swf-document.service';
import {
  ConfidentialityType,
  ConfidentialityTypes,
} from '../../../../../types/confidentiality.type';
import { UploadOptions } from '../../../../../types/upload-options.type';

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
    LoadingModule,
  ],
  templateUrl: './document-upload-metadata-modal.component.html',
  styleUrl: './document-upload-metadata-modal.component.scss',
})
export class DocumentUploadMetadataModal {
  private readonly modalService = inject(ModalService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly translateService = inject(TranslateService);
  private readonly iconService = inject(IconService);
  private readonly documentService = inject(DocumentService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly swfDocumentService: SwfDocumentService =
    inject(SwfDocumentService);

  readonly modal = viewChild.required<VModalComponent>('uploadModal');

  protected readonly isUploading = input(false);
  readonly submitted = output<
    UploadDocumentMetadata | UploadDocumentToDocumentenApiMetadata
  >();
  readonly cancelled = output<void>();

  protected readonly uploadOptions: InputSignal<UploadOptions> = input<UploadOptions>({ uploadToDocumentenApi: false });

  private readonly updateDocumentTypeValidator = effect(() => {
    const control = this.metadataForm.controls.documentType;

    if (this.uploadOptions().uploadToDocumentenApi) {
      control.setValidators(Validators.required);
    } else {
      control.clearValidators();
    }

    control.updateValueAndValidity();
  });

  protected readonly metadataForm = this.formBuilder.group({
    documentDescription: [''],
    numberWithinSystem: [''],
    confidentialityType: [
      ConfidentialityTypes.Confidential as ConfidentialityType,
      Validators.required,
    ],
    systemId: [''],
    documentType: [
      null as DocumentType | null,
      Validators.required
    ]
  });

  protected confidentialityTypeTooltipText = this.translateService.instant(
    'samenwerkfunctionaliteit.documentTable.documentUploadModal.confidentialityTypeTooltip',
  );

  protected documentTypeTooltipText = this.translateService.instant(
    'samenwerkfunctionaliteit.documentTable.documentUploadModal.documentTypeTooltip',
  );

  protected confidentialityOptions = [
    {
      value: ConfidentialityTypes.Confidential,
      label: this.translateService.instant(
        'samenwerkfunctionaliteit.types.confidentiality.confidential',
      ),
    },
    {
      value: ConfidentialityTypes.StrictlyConfidential,
      label: this.translateService.instant(
        'samenwerkfunctionaliteit.types.confidentiality.strictlyConfidential',
      ),
    },
  ];

  ngOnInit() {
    this.iconService.registerAll([Information32, Upload32]);
  }

  resetForm(): void {
    this.metadataForm.reset({
      documentDescription: '',
      numberWithinSystem: '',
      confidentialityType: ConfidentialityTypes.Confidential,
      systemId: '',
      documentType: null,
    });

    this.metadataForm.markAsPristine();
    this.metadataForm.markAsUntouched();
  }

  protected submit(): void {
    if (this.metadataForm.invalid) {
      this.metadataForm.markAllAsTouched();
      return;
    }

    const metadata: UploadDocumentMetadata = {
      documentDescription:
        this.metadataForm.controls.documentDescription.value || undefined,
      numberWithinSystem:
        this.metadataForm.controls.numberWithinSystem.value || undefined,
      confidentialityType:
        this.metadataForm.controls.confidentialityType.value || undefined,
      systemId:
        this.metadataForm.controls.systemId.value || undefined,

      uploadToDocumentenApi: false,
    };

    if (this.uploadOptions().uploadToDocumentenApi) {
      const documentType =
        this.metadataForm.controls.documentType.value;

      if (!documentType) {
        return;
      }

      this.submitted.emit({
        ...metadata,
        documentType,

        uploadToDocumentenApi: true,
      });

      return;
    }

    this.submitted.emit(metadata);
  }

  protected cancel(): void {
    this.resetForm();

    this.modalService.closeModal(() => {
      this.cancelled.emit();
    });
  }

  protected getIsRequiredText(formControlName: string): string {
    const formControl = this.metadataForm.get(formControlName);

    if (!formControl) {
      throw new Error(`Form control ${formControlName} does not exist`);
    }

    if (!formControl.hasValidator(Validators.required)) {
      return '';
    }
    return this.translateService.instant(
      'samenwerkfunctionaliteit.common.validation.required',
    );
  }
}
