import { Links } from './links.dto';
import { Page } from './page.dto';

export interface BerichtenOverzichtResponse {
  _embedded: BerichtenResponse | null;
  _links: Links | null;
  page: Page;
}

interface BerichtenResponse {
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
