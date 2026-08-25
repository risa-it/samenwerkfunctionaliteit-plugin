import { BusinessKey } from '../types/business-key.type';

export interface UploadContext {
  file: File;
  samenwerkingId: string;
  businessKey: BusinessKey;
  caseDefinitionKey: string;
  caseDefinitionVersionTag: string;
}
