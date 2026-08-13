import { ConfidentialityType } from '../types/confidentiality.type';
import { UUID } from '../types/uuid.type';

export interface DocumentInterface {
  samenwerkingId: string;
  documentId: UUID;
  filename: string;
  confidentialityLevel: ConfidentialityType;
  creationDate: string;
}
