import { ActieverzoekId } from '../types/actieverzoek-id.type';
import { OpenZaakId } from '../types/open-zaak-id.type';
import { SamenwerkingId } from '../types/samenwerking-id.type';

export interface SwfCaseProperties {
  samenwerkingId: SamenwerkingId;
  actieverzoekId: ActieverzoekId;
  openZaakId: OpenZaakId;
  isSwfCase: boolean;
}
