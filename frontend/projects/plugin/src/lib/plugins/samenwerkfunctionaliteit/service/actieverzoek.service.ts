import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import {
  Actieverzoek,
  ActieverzoekUpdateData,
} from '../models/actieverzoek.model';
import { map } from 'rxjs/operators';
import {
  ActieverzoekResponse,
  createUpdateActieverzoekRequestFrom,
  mapActieverzoekResponseToActieverzoek,
} from '../dto/actieverzoek.dto';
import { ActieverzoekClient } from '../client/actieverzoek-client.service';
import { BusinessKey } from '../types/business-key.type';

@Injectable({
  providedIn: 'root',
})
export class ActieverzoekService {
  private readonly actieverzoekClient: ActieverzoekClient =
    inject(ActieverzoekClient);

  getActieverzoek(
    actieverzoekId: string,
    businessKey: BusinessKey,
  ): Observable<Actieverzoek> {
    return this.actieverzoekClient.getActieverzoek(actieverzoekId).pipe(
      map((actieverzoekResponse: ActieverzoekResponse) => {
        return mapActieverzoekResponseToActieverzoek(actieverzoekResponse);
      }),
    );
  }

  updateActieverzoekStatus(
    actieverzoekId: string,
    actieverzoekUpdateData: ActieverzoekUpdateData,
  ): Observable<Actieverzoek> {
    const updateActieverzoekRequest = createUpdateActieverzoekRequestFrom(
      actieverzoekUpdateData,
    );

    return this.actieverzoekClient
      .updateActieverzoekStatus(actieverzoekId, updateActieverzoekRequest)
      .pipe(
        map((actieverzoekResponse: ActieverzoekResponse) => {
          return mapActieverzoekResponseToActieverzoek(actieverzoekResponse);
        }),
        catchError(() => {
          throw new Error(
            'Gemeentelijke Gezondheidsdienst en Veilig Thuis Haaglanden mag de status van dit actieverzoek niet wijzigen in deze combinatie.',
          );
        }),
      );
  }
}
