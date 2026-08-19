import { Document } from './document.model';
import { Links } from './links.model';
import { ActieverzoekStatusType } from '../types/actieverzoek-status.type';

export interface Actieverzoek {
  links: Links;
  title: string;
  amountOfMessages: number;
  actieverzoekId: string;
  createdOn: Date;
  documents: Document[];
  lastChangedDateTime: string;
  lastChangedBy: string;
  lastChangedByName: string;
  notice: string;
  description: string;
  receiver: string;
  receiverName: string;
  productId: string;
  samenwerkingId: string;
  status: ActieverzoekStatusType;
  sender: string;
  senderName: string;
}

export interface ActieverzoekUpdateData {
  notice: string;
  description: string;
  productId: string;
  status: ActieverzoekStatusType;
  title: string;
}
