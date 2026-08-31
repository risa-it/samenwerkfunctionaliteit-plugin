import { inject, Injectable } from '@angular/core';
import { SamenwerkingClient } from '../client/samenwerking.client';
import { Observable } from 'rxjs';
import { Samenwerking } from '../models/samenwerking.model';

@Injectable({
  providedIn: 'root',
})
export class SamenwerkingService {
  private readonly samenwerkingClient = inject(SamenwerkingClient);

  getSamenwerking(samenwerkingId: string): Observable<Samenwerking> {
    return this.samenwerkingClient.getSamenwerking(samenwerkingId).pipe();
  }
}
