import { Links } from './links.dto';
import { Page } from './page.dto';
import {
  Notificatie as NotificatieModel,
  NotificatiePage,
} from '../models/notificatie.model';
import {
  NotificatieType,
  NotificatieTypes,
} from '../components/notificatie-card-list/type/notificatie.type';

export interface NotificatieResponse {
  page: Page;
  _embedded: {
    notificaties: NotificatieDto[];
  };
  _links: Links;
}

export interface NotificatieDto {
  notificatieId: string;
  notificatieType: string;
  samenwerkingId: string;
  samenwerkVorm: string;
  notificatieTitel: string;
  notificatieTekst: string;
  eventInitiator: string;
  eventInitiatorNaam: string;
  deelnemer: string;
  deelnemerNaam: string;
  eventDatumTijd: string;
  properties: Map<string, string>;
  _links: Links;
}

export function mapNotificatieResponseToNotificatiePage(
  notificatieResponse: NotificatieResponse,
): NotificatiePage {
  return {
    page: {
      item: mapNotificatieDtosToModels(notificatieResponse),
      number: notificatieResponse.page.number,
      size: notificatieResponse.page.size,
      totalElements: notificatieResponse.page.totalElements,
      totalPages: notificatieResponse.page.totalPages,
    },
  };
}

export function mapNotificatieDtosToModels(
  response: NotificatieResponse,
): NotificatieModel[] {
  return response._embedded.notificaties.map(mapNotificatieDtoToModel);
}

function mapNotificatieDtoToModel(
  notificatie: NotificatieDto,
): NotificatieModel {
  return {
    notificatieId: notificatie.notificatieId,
    notificatieType: mapStringToNotificatieType(notificatie.notificatieType),
    samenwerkingId: notificatie.samenwerkingId,
    samenwerkingType: notificatie.samenwerkVorm,
    notificatieTitel: notificatie.notificatieTitel,
    notificatieText: notificatie.notificatieTekst,
    eventInitiator: notificatie.eventInitiator,
    eventInitiatorName: notificatie.eventInitiatorNaam,
    participant: notificatie.deelnemer,
    participantName: notificatie.deelnemerNaam,
    eventDateTime: new Date(notificatie.eventDatumTijd),
    properties: notificatie.properties,
    _links: notificatie._links,
  };
}

function mapStringToNotificatieType(
  notificatieTypeString: string,
): NotificatieType {
  switch (notificatieTypeString) {
    case 'DOCUMENT_TOEGEVOEGD':
      return NotificatieTypes.DocumentCreated;
    case 'DOCUMENT_GEWIJZIGD':
      return NotificatieTypes.DocumentEdited;
    case 'DOCUMENT_VERWIJDERD':
      return NotificatieTypes.DocumentDeleted;
    case 'STATUS_ACTIEVERZOEK_GEWIJZIGD':
      return NotificatieTypes.ActieverzoekStatusChanged;
    case 'UITNODIGING_KETENPARTNER':
      return NotificatieTypes.InvitationPartnerOrganization;
    case 'VERZOEK_OPHALEN_GESLAAGD':
      return NotificatieTypes.RequestRetrievalSucceeded;
    case 'NIEUW_BERICHT':
      return NotificatieTypes.MessageSent;

    default:
      throw new Error(`Unknown notificatie type: ${notificatieTypeString}`);
  }
}
