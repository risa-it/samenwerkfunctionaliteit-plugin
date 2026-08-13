import { DocumentInterface } from '../interface/document.interface';
import { ConfidentialityType } from '../types/confidentiality.type';
import { UUID } from '../types/uuid.type';

export class Document implements DocumentInterface {
  constructor(
    readonly samenwerkingId: string,
    readonly documentId: UUID,
    readonly fileName: string,
    readonly confidentialityLevel: ConfidentialityType,
    readonly creationDate: string,
  ) {}
}
