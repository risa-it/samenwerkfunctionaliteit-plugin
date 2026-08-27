import { NotificatieType } from '../components/notificatie-card-list/type/notificatie.type';
import { Links } from './links.model';

export interface Notificatie {
  notificatieId: string;
  notificatieType: NotificatieType;
  samenwerkingId: string;
  samenwerkingType: string;
  notificatieTitel: string;
  notificatieText: string;
  eventInitiator: string;
  eventInitiatorName: string;
  participant: string;
  participantName: string;
  eventDateTime: Date;
  properties: Map<string, string>;
  _links: Links;
}
