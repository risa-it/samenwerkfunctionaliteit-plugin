import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  DOCUMENTEN_URL,
  SAMENWERKINGEN_URL,
} from '../config/swf-plugin-config';
import {
  DocumentenOverzichtResponse,
  mapConfidentialityTypeToVertrouwelijkheidsaanduiding,
} from '../dto/document.dto';
import { FileDownload } from '../interface/file-download.interface';
import { UploadDocumentMetadata } from '../interface/upload-document-metadata.interface';
import { UUID } from '../types/uuid.type';
import { FileResponseUtil } from '../utils/file-response.util';

@Injectable({
  providedIn: 'root',
})
export class DocumentClient {
  private readonly http: HttpClient = inject(HttpClient);

  getDocumenten(
    samenwerkingId: string,
  ): Observable<DocumentenOverzichtResponse> {
    return this.http.get<DocumentenOverzichtResponse>(
      `${SAMENWERKINGEN_URL}/${samenwerkingId}/documenten`,
    );
  }

  downloadDocument(documentId: UUID): Observable<FileDownload> {
    return this.http
      .get(`${DOCUMENTEN_URL}/${documentId}/content`, {
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        map((response: HttpResponse<Blob>): FileDownload => {
          return FileResponseUtil.toFileDownload(response);
        }),
      );
  }

  uploadDocument(
    file: File,
    samenwerkingId: string,
    metadata?: UploadDocumentMetadata,
  ): Observable<void> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const params = this.convertUploadDocumentMetadataToHttpParams(
      metadata ?? {},
    );

    return this.http.post<void>(
      `${SAMENWERKINGEN_URL}/${samenwerkingId}/documenten`,
      formData,
      { params },
    );
  }

  deleteDocument(documentId: UUID): Observable<void> {
    return this.http.delete<void>(`${DOCUMENTEN_URL}/${documentId}`);
  }

  private convertUploadDocumentMetadataToHttpParams(
    metadata: UploadDocumentMetadata,
  ): HttpParams {
    let params = new HttpParams();

    if (metadata?.documentDescription != null) {
      params = params.set('documentOmschrijving', metadata.documentDescription);
    }
    if (metadata?.numberWithinSystem != null) {
      params = params.set('nummerBinnenSysteem', metadata.numberWithinSystem);
    }
    if (metadata?.systemId != null) {
      params = params.set('kenmerkSysteem', metadata.systemId);
    }
    if (metadata?.confidentialityType != null) {
      params = params.set(
        'vertrouwelijkheidsAanduiding',
        mapConfidentialityTypeToVertrouwelijkheidsaanduiding(
          metadata.confidentialityType,
        ),
      );
    }
    if (metadata?.language != null) {
      params = params.set('taal', metadata.language);
    }

    return params;
  }
}
