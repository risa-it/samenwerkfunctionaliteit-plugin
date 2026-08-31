import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  NOTIFICATIES_PATH,
  SAMENWERKINGEN_URL,
} from '../config/swf-plugin-config';
import { NotificatieResponse } from '../dto/notificatie.dto';

@Injectable({
  providedIn: 'root',
})
export class NotificatieClient {
  private readonly http: HttpClient = inject(HttpClient);

  getNotificaties(
    samenwerkingId: string,
    page: number,
    size: number,
  ): Observable<NotificatieResponse> {
    const params: HttpParams = new HttpParams()
      .set('page', page)
      .set('amount', size);
    return this.http.get<NotificatieResponse>(
      `${SAMENWERKINGEN_URL}/${samenwerkingId}/${NOTIFICATIES_PATH}`,
      {
        params,
      },
    );
  }
}
