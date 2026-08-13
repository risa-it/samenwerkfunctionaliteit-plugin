import { ConfidentialityType } from '../types/confidentiality.type';
import { UUID } from '../types/uuid.type';

export interface DocumentInterface {
  samenwerkingId: string;
  documentId: UUID;
  fileName: string;
  confidentialityLevel: ConfidentialityType;
  creationDate: string;
}
