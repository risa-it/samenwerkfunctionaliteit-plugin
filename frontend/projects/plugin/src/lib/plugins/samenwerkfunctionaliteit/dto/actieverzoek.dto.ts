import {
  Actieverzoek,
  ActieverzoekUpdateData,
} from '../models/actieverzoek.model';
import {
  ActieverzoekStatusType,
  ActieverzoekStatusTypes,
} from '../types/actieverzoek-status.type';
import { DocumentResponse, mapDocumentenResponseToModel } from './document.dto';
import { Links } from './links.dto';

export interface ActieverzoekResponse {
  _links: Links;
  aantalBerichten: number;
  actieverzoekId: string;
  creatieDatumTijd: string;
  documenten: DocumentResponse[];
  laatstAangepastDatumTijd: string;
  laatstAangepastDoor: string;
  laatstAangepastDoorNaam: string;
  melding: string;
  omschrijving: string;
  ontvanger: string;
  ontvangerNaam: string;
  productId: string;
  samenwerkingId: string;
  status: ActieverzoekStatus;
  titel: string;
  zender: string;
  zenderNaam: string;
}

export interface UpdateActieverzoekRequest {
  melding: string;
  omschrijving: string;
  productId: string;
  status: ActieverzoekStatus;
  titel: string;
}

export enum ActieverzoekStatus {
  OPEN = 'OPEN',
  IN_BEHANDELING = 'IN_BEHANDELING',
  GEWEIGERD = 'GEWEIGERD',
  INGETROKKEN = 'INGETROKKEN',
  GEREEDGEMELD = 'GEREEDGEMELD',
  GEREED = 'GEREED',
}

export function mapActieverzoekStatusToActieverzoekStatusType(
  actieverzoekStatus: ActieverzoekStatus,
): ActieverzoekStatusType {
  switch (actieverzoekStatus) {
    case ActieverzoekStatus.OPEN:
      return ActieverzoekStatusTypes.Open;
    case ActieverzoekStatus.IN_BEHANDELING:
      return ActieverzoekStatusTypes.InProgress;
    case ActieverzoekStatus.GEWEIGERD:
      return ActieverzoekStatusTypes.Rejected;
    case ActieverzoekStatus.INGETROKKEN:
      return ActieverzoekStatusTypes.Withdrawn;
    case ActieverzoekStatus.GEREEDGEMELD:
      return ActieverzoekStatusTypes.ReportedReady;
    case ActieverzoekStatus.GEREED:
      return ActieverzoekStatusTypes.Ready;
    default:
      throw new Error(`Invalid ActieverzoekStatus: ${actieverzoekStatus}`);
  }
}

export function mapLinkActionToActieverzoekStatus(
  linkAction: string,
): ActieverzoekStatus {
  switch (linkAction) {
    case 'weigeren':
      return ActieverzoekStatus.GEWEIGERD;
    case 'behandelen':
      return ActieverzoekStatus.IN_BEHANDELING;
    case 'gereedmelden':
      return ActieverzoekStatus.GEREEDGEMELD;

    default:
      throw new Error(`Invalid link action: ${linkAction}`);
  }
}

function mapActieverzoekStatusTypeToActieverzoekStatus(
  actieverzoekStatusType: ActieverzoekStatusType,
): ActieverzoekStatus {
  switch (actieverzoekStatusType) {
    case ActieverzoekStatusTypes.Open:
      return ActieverzoekStatus.OPEN;
    case ActieverzoekStatusTypes.InProgress:
      return ActieverzoekStatus.IN_BEHANDELING;
    case ActieverzoekStatusTypes.Rejected:
      return ActieverzoekStatus.GEWEIGERD;
    case ActieverzoekStatusTypes.Withdrawn:
      return ActieverzoekStatus.INGETROKKEN;
    case ActieverzoekStatusTypes.ReportedReady:
      return ActieverzoekStatus.GEREEDGEMELD;
    case ActieverzoekStatusTypes.Ready:
      return ActieverzoekStatus.GEREED;
    default:
      throw new Error(
        `Invalid ActieverzoekStatusType: ${actieverzoekStatusType}`,
      );
  }
}

export function mapActieverzoekResponseToActieverzoek(
  actieverzoekResponse: ActieverzoekResponse,
): Actieverzoek {
  return {
    amountOfMessages: actieverzoekResponse.aantalBerichten,
    description: actieverzoekResponse.omschrijving,
    documents: (actieverzoekResponse.documenten ?? []).map(
      mapDocumentenResponseToModel,
    ),
    lastChangedBy: actieverzoekResponse.laatstAangepastDoor,
    lastChangedByName: actieverzoekResponse.laatstAangepastDoorNaam,
    lastChangedDateTime: actieverzoekResponse.laatstAangepastDatumTijd,
    links: actieverzoekResponse._links,
    notice: actieverzoekResponse.melding,
    productId: actieverzoekResponse.productId,
    samenwerkingId: actieverzoekResponse.samenwerkingId,
    status: mapActieverzoekStatusToActieverzoekStatusType(
      actieverzoekResponse.status,
    ),
    title: actieverzoekResponse.titel,
    actieverzoekId: actieverzoekResponse.actieverzoekId,
    receiver: actieverzoekResponse.ontvanger,
    receiverName: actieverzoekResponse.ontvangerNaam,
    createdOn: new Date(actieverzoekResponse.creatieDatumTijd),
    sender: actieverzoekResponse.zender,
    senderName: actieverzoekResponse.zenderNaam,
  };
}

export function createUpdateActieverzoekRequestFrom(
  actieverzoekUpdateData: ActieverzoekUpdateData,
): UpdateActieverzoekRequest {
  return {
    melding: actieverzoekUpdateData.notice,
    omschrijving: actieverzoekUpdateData.description,
    productId: actieverzoekUpdateData.productId,
    status: mapActieverzoekStatusTypeToActieverzoekStatus(
      actieverzoekUpdateData.status,
    ),
    titel: actieverzoekUpdateData.title,
  };
}
