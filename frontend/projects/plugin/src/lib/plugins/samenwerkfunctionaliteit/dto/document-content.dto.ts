import { OpenZaakProperties } from './open-zaak-properties.model';
import { SamenwerkingProperties } from './samenwerking-properties.dto';

export interface SamenwerkfunctionaliteitDocument {
  samenwerkingProperties: SamenwerkingProperties;
  isAutomaticallyGenerated: boolean;
  openzaak: OpenZaakProperties;
}
