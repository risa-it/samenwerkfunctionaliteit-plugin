import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { NotificatieClient } from '../client/notificatie-client.service';
import {
  mapNotificatieResponseToNotificatiePage,
  NotificatieResponse,
} from '../dto/notificatie.dto';
import { NotificatiePage } from '../models/notificatie.model';

@Injectable({
  providedIn: 'root',
})
export class NotificatieService {
  notificatieClient = inject(NotificatieClient);

  getNotificaties(
    samenwerkingId: string,
    page: number,
    size: number,
  ): Observable<NotificatiePage> {
    return this.notificatieClient
      .getNotificaties(samenwerkingId, page, size)
      .pipe(
        map((response: NotificatieResponse) => {
          return mapNotificatieResponseToNotificatiePage(response);
        }),
      );
  }
}
