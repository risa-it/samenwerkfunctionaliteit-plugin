import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Samenwerking } from '../dto/samenwerking.dto';
import { Observable } from 'rxjs';
import { SAMENWERKINGEN_URL } from '../config/swf-plugin-config';

@Injectable({
  providedIn: 'root',
})
export class SamenwerkingClient {
  private readonly http: HttpClient = inject(HttpClient);

  getSamenwerking(samenwerkingId: string): Observable<Samenwerking> {
    return this.http.get<Samenwerking>(
      `/${SAMENWERKINGEN_URL}/${samenwerkingId}`,
    );
  }
}
