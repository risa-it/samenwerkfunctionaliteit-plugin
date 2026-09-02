import { inject, Injectable } from '@angular/core';
import { DocumentService as ValtimoDocumentService } from '@valtimo/document';
import { OpenZaakService } from '@valtimo/resource';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { SamenwerkfunctionaliteitDocument } from '../dto/document-content.dto';
import { OpenZaakInfo } from '../interface/open-zaak-info.interface';
import { BusinessKey } from '../types/business-key.type';

@Injectable({
  providedIn: 'root',
})
export class OpenZaakUrlService {
  private static readonly OPEN_ZAAK_ID_PATH = 'content.openzaak.identificatie';
  valtimoDocumentService: ValtimoDocumentService = inject(
    ValtimoDocumentService,
  );
  openZaakService: OpenZaakService = inject(OpenZaakService);
  private openZaakInfoCache: Map<BusinessKey, OpenZaakInfo> = new Map<
    BusinessKey,
    OpenZaakInfo
  >();

  getOpenZaakInfo(businessKey: BusinessKey): Observable<OpenZaakInfo> {
    if (this.openZaakInfoCache.get(businessKey)) {
      return of(this.openZaakInfoCache.get(businessKey));
    }
    return forkJoin({
      document: this.valtimoDocumentService.getDocument(businessKey),
      zaakTypes: this.openZaakService.getZaakTypes(),
    }).pipe(
      map(({ document, zaakTypes }) => {
        const documentContentWithOpenZaakProperties =
          document.content as SamenwerkfunctionaliteitDocument;
        const openZaakId =
          documentContentWithOpenZaakProperties.openzaak.identificatie;

        if (!openZaakId) {
          throw new Error(
            `OpenZaak ID is not available in the document (searching at '${OpenZaakUrlService.OPEN_ZAAK_ID_PATH}').`,
          );
        }

        const zaakTypeUrl = zaakTypes[0]?.url;

        if (!zaakTypeUrl) {
          throw new Error(`No Zaaktypes found for ${zaakTypeUrl}.`);
        }

        const baseUrl = new URL(zaakTypeUrl).origin;

        return {
          id: openZaakId,
          baseUrl,
          searchUrl: `${baseUrl}/admin/zaken/zaak/?q=${openZaakId}`,
        };
      }),
      tap((openZaakInfo: OpenZaakInfo) => {
        this.loadOpenZaakInfoIntoCache(businessKey, openZaakInfo);
      }),
    );
  }

  private loadOpenZaakInfoIntoCache(
    businessKey: BusinessKey,
    openZaakInfo: OpenZaakInfo,
  ): void {
    this.openZaakInfoCache.set(businessKey, openZaakInfo);
  }
}
