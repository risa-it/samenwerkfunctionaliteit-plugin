export interface SamenwerkingProperties {
  samenwerkingId: string;
  actieverzoekDetails: ActieverzoekDetails;
  isAutomaticallyGenerated: boolean;
}

interface ActieverzoekDetails {
  actieverzoekId: string;
  deelnemer: string;
  eventDatumTijd: string;
  eventInitiator: string;
}
