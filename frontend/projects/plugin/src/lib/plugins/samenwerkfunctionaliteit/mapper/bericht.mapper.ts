import { BerichtenOverzichtResponse } from '../dto/berichten.dto';
import { PostBerichtResponseDto } from '../dto/post-bericht-response.dto';
import { Bericht, Message } from '../models/bericht.model';

export function mapPostBerichtResponseDtoToBericht(
  dto: PostBerichtResponseDto,
): Bericht {
  return {
    _links: dto._links,
    actieverzoekId: dto.actieverzoekId,
    berichtId: dto.berichtId,
    creatieDatumTijd: dto.creatieDatumTijd,
    inhoud: dto.inhoud,
    ontvanger: dto.ontvanger,
    ontvangerNaam: dto.ontvangerNaam,
    samenwerkingId: dto.samenwerkingId,
    zender: dto.zender,
    zenderNaam: dto.zenderNaam,
  };
}

export function mapBerichtenOverzichtResponseToMessages(
  dto: BerichtenOverzichtResponse | undefined,
): Message[] {
  if (!dto?._embedded?.berichten) return [];

  return dto?._embedded?.berichten.map(
    (bericht): Message => mapBerichtToMessage(bericht),
  );
}

function mapBerichtToMessage(bericht: Bericht): Message {
  return {
    messageId: bericht.berichtId,
    createdOn: new Date(bericht.creatieDatumTijd),
    content: bericht.inhoud,
    receiver: bericht.ontvanger,
    receiverName: bericht.ontvangerNaam,
    samenwerkingId: bericht.samenwerkingId,
    sender: bericht.zender,
    senderName: bericht.zenderNaam,
  };
}
