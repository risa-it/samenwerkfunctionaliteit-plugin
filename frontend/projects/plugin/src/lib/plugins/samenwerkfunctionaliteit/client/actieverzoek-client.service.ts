import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ACTIEVERZOEKEN_URL } from '../config/swf-plugin-config';
import {
  ActieverzoekResponse,
  UpdateActieverzoekRequest,
} from '../dto/actieverzoek.dto';

@Injectable({
  providedIn: 'root',
})
export class ActieverzoekClient {
  private readonly http: HttpClient = inject(HttpClient);

  getActieverzoek(actieverzoekId: string): Observable<ActieverzoekResponse> {
    return this.http.get<ActieverzoekResponse>(
      `${ACTIEVERZOEKEN_URL}/${actieverzoekId}`,
    );
  }

  updateActieverzoekStatus(
    actieverzoekId: string,
    updateActieverzoekRequest: UpdateActieverzoekRequest,
  ): Observable<ActieverzoekResponse> {
    const header = new HttpHeaders({
      'Content-Type': 'application/merge-patch+json',
    });

    return this.http.patch<ActieverzoekResponse>(
      `${ACTIEVERZOEKEN_URL}/${actieverzoekId}`,
      updateActieverzoekRequest,
      { headers: header },
    );
  }
}
