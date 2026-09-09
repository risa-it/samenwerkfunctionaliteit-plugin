import { DocumentType } from '@valtimo/document';
import { ConfidentialityType } from '../types/confidentiality.type';

export interface UploadDocumentMetadata {
  documentDescription?: string;
  numberWithinSystem?: string;
  systemId?: string;
  confidentialityType?: ConfidentialityType;
  language?: string;
  uploadToDocumentenApi: false;
}

export interface UploadDocumentToDocumentenApiMetadata extends Omit<UploadDocumentMetadata, 'uploadToDocumentenApi'> {
  uploadToDocumentenApi: true;
  documentType: DocumentType;
}

export type UploadMetadata =
  | UploadDocumentMetadata
  | UploadDocumentToDocumentenApiMetadata;
