import { ConfidentialityType } from '../types/confidentiality.type';

export interface UploadDocumentMetadata {
  documentDescription?: string;
  numberWithinSystem?: string;
  systemId?: string;
  confidentialityType?: ConfidentialityType;
  language?: string;
}
