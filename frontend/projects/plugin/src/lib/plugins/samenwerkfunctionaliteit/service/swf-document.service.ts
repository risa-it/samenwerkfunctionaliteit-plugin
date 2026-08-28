import { inject, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Document as ValtimoDocument,
  DocumentService as ValtimoDocumentService,
} from '@valtimo/document';
import { map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { SamenwerkfunctionaliteitDocument } from '../dto/document-content.dto';
import { SwfCaseProperties } from '../interface/swf-case-properties.interface';
import { toActieverzoekId } from '../types/actieverzoek-id.type';
import { BusinessKey } from '../types/business-key.type';
import { toOpenZaakId } from '../types/open-zaak-id.type';
import { toSamenwerkingId } from '../types/samenwerking-id.type';

@Injectable({
  providedIn: 'root',
})
export class SwfDocumentService implements OnDestroy {
  private valtimoDocumentService: ValtimoDocumentService = inject(
    ValtimoDocumentService,
  );
  private samenwerkingPropsCache: Map<BusinessKey, SwfCaseProperties> = new Map<
    BusinessKey,
    SwfCaseProperties
  >();
  destroy$: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  /**
   * Extracts a route parameter from the caller's ActivatedRoute.
   * @param route The caller's ActivatedRoute, which the caller must have injected.
   * @param paramName The name of the route parameter to extract.
   * @returns The parameter value as a string, or null if not found.
   */
  getParam(route: ActivatedRoute, paramName: string): string | null {
    return route.snapshot.paramMap.get(paramName);
  }

  /**
   * Gets the samenwerkingIds for a given documentId.
   * If the documentId is not in the cache, it fetches from source.
   * @param businessKey The document ID to look up.
   * @returns The samenwerkingId, or null if not found.
   */
  getSamenwerkingProperties(
    businessKey: BusinessKey,
  ): Observable<SwfCaseProperties> {
    const cachedProperties: SwfCaseProperties | undefined =
      this.samenwerkingPropsCache.get(businessKey);

    if (cachedProperties) {
      return of(cachedProperties);
    }

    return this.valtimoDocumentService.getDocument(businessKey.toString()).pipe(
      takeUntil(this.destroy$),
      map((document) => this.mapValtimoDocumentToSwfCaseProperties(document)),
      tap((swfCaseProperties: SwfCaseProperties) => {
        this.loadPropsIntoCache(businessKey, swfCaseProperties);
      }),
    );
  }

  private mapValtimoDocumentToSwfCaseProperties(
    document: ValtimoDocument,
  ): SwfCaseProperties {
    const swfDocument = document.content as SamenwerkfunctionaliteitDocument;

    return {
      samenwerkingId: toSamenwerkingId(
        swfDocument.samenwerkingProperties.samenwerkingId,
      ),
      actieverzoekId: toActieverzoekId(
        swfDocument.samenwerkingProperties.actieverzoekDetails.actieverzoekId,
      ),
      isSwfCase: swfDocument.isAutomaticallyGenerated,
      openZaakId: toOpenZaakId(swfDocument.openzaak.identificatie),
    };
  }

  private loadPropsIntoCache(
    businessKey: BusinessKey,
    samenwerkingProperties: SwfCaseProperties,
  ): void {
    this.samenwerkingPropsCache.set(businessKey, samenwerkingProperties);
  }
}
