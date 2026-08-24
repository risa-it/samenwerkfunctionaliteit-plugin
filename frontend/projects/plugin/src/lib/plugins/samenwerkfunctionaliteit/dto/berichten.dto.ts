import { Links } from './links.dto';
import { Page } from './page.dto';

export interface BerichtenOverzichtResponse {
  _embedded: Berichten;
  _links: Links;
  page: Page;
}

interface Berichten {
  berichten: BerichtResponse[];
}

interface BerichtResponse {
  _links?: Links;
  actieverzoekId: string;
  berichtId: string;
  creatieDatumTijd: string;
  inhoud: string;
  ontvanger: string;
  ontvangerNaam?: string;
  samenwerkingId?: string;
  zender?: string;
  zenderNaam?: string;
}
