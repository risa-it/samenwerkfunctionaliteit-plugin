import { DocumentInterface } from '../interface/document.interface';
import { Document } from '../models/document.model';
import {
  ConfidentialityType,
  ConfidentialityTypes,
} from '../types/confidentiality.type';
import { Links } from './links.dto';
import { Page } from './page.dto';

export interface DocumentenOverzichtResponse {
  _embedded: DocumentenResponse | null;
  _links: Links | null;
  page: Page;
}

interface DocumentenResponse {
  documenten: DocumentResponse[];
}

export interface DocumentResponse {
  documentId: string;
  bestandsNaam: string;
  kenmerkSysteem: string | null;
  nummerBinnenSysteem: string | null;
  samenwerkingId: string;
  aangemaaktDoor: string;
  aangemaaktDoorNaam: string;
  creatieDatumTijd: string;
  laatstAangepastDoor: string | null;
  laatstAangepastDoorNaam: string | null;
  laatstAangepastDatumTijd: string | null;
  documentOmschrijving: string | null;
  vertrouwelijkheidsAanduiding: string | null;
  taal: string | null;
  formaat: string | null;
  documentHash: string | null;
  links: Links | null;
}

export function mapDocumentenResponseToModel(
  documentenResponse: DocumentResponse,
): DocumentInterface {
  return new Document(
    documentenResponse.samenwerkingId,
    toUUID(documentenResponse.documentId),
    documentenResponse.bestandsNaam,
    mapVertrouwelijkheidsAanduidingToConfidentialityType(
      documentenResponse.vertrouwelijkheidsAanduiding,
    ),
    documentenResponse.creatieDatumTijd,
  );
}

function mapVertrouwelijkheidsAanduidingToConfidentialityType(
  vertrouwelijkheidsAanduiding: string | null,
): ConfidentialityType {
  switch (vertrouwelijkheidsAanduiding) {
    case 'RV':
      return ConfidentialityTypes.Confidential;
    case 'SV':
      return ConfidentialityTypes.StrictlyConfidential;
    case null:
      return ConfidentialityTypes.Confidential;
    default:
      throw new Error(
        `Unknown vertrouwelijkheidsAanduiding: ${vertrouwelijkheidsAanduiding}`,
      );
  }
}

export function mapConfidentialityTypeToVertrouwelijkheidsaanduiding(
  confidentialityType: ConfidentialityType,
): string {
  switch (confidentialityType) {
    case ConfidentialityTypes.Confidential:
      return 'RV';
    case ConfidentialityTypes.StrictlyConfidential:
      return 'SV';
    default:
      throw new Error(`Unknown confidentialityType: ${confidentialityType}`);
  }
}

export function mapDocumentenResponseToModels(
  documenten: DocumentenOverzichtResponse,
): DocumentInterface[] {
  return documenten._embedded.documenten.map(mapDocumentenResponseToModel);
}
