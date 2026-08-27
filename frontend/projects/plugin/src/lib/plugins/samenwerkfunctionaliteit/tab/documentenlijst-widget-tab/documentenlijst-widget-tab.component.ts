import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InputModule, NotificationModule } from 'carbon-components-angular';
import { catchError, finalize, take, tap, throwError } from 'rxjs';
import { DocumentListComponent } from '../../components/document-list/document-list.component';
import { SwfCaseProperties } from '../../interface/swf-case-properties.interface';
import { OpenZaakUrlService } from '../../service/open-zaak-url.service';
import { SwfDocumentService } from '../../service/swf-document.service';
import { toBusinessKey } from '../../types/business-key.type';

@Component({
  templateUrl: `./documentenlijst-widget-tab.component.html`,
  styleUrl: `./documentenlijst-widget-tab.component.scss`,
  selector: 'swf-documentenlijst-widget-tab',
  imports: [
    DocumentListComponent,
    InputModule,
    TranslateModule,
    NotificationModule,
  ],
})
export class DocumentenlijstWidgetTabComponent implements OnInit {
  private readonly openZaakUrlService: OpenZaakUrlService =
    inject(OpenZaakUrlService);
  private readonly swfDocumentService: SwfDocumentService =
    inject(SwfDocumentService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  protected isLoading: WritableSignal<boolean> = signal<boolean>(true);
  protected isSamenwerkingDossier: WritableSignal<boolean> = signal(false);

  protected openZaakUrl: string = '';
  protected helperText: string = '';

  ngOnInit() {
    const documentId = this.swfDocumentService.getParam(
      this.route,
      'documentId',
    );
    if (!documentId) {
      throw new Error("Couldn't find documentId!");
    }

    this.getOpenZaakInfoAndSetHelperText(documentId);

    this.setIsSamenwerkingDossier(documentId)
  }

  private getOpenZaakInfoAndSetHelperText(documentId: string) {
    const businessKey = toBusinessKey(documentId);

    this.openZaakUrlService
      .getOpenZaakInfo(businessKey)
      .pipe(
        take(1),
        tap((openZaakInfo) => {
          this.openZaakUrl = openZaakInfo.searchUrl;
          this.setHelperText();
        }),
        catchError((err) => {
          return throwError(() => {
            return err;
          });
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  private setIsSamenwerkingDossier(documentId: string) {
    this.swfDocumentService
      .getSamenwerkingProperties(toBusinessKey(documentId))
      .pipe(
        take(1),
        tap((samenwerkingProperties: SwfCaseProperties) => {
          this.isSamenwerkingDossier.set(samenwerkingProperties.isSwfCase);
        }),
      )
      .subscribe();
  }

  private setHelperText() {
    this.helperText =
      'Documenten die vanuit GZAC naar de Samenwerkfunctionaliteit worden geüpload, worden daarnaast ook in Open Zaak opgeslagen. De bewaartermijn kan voor het zaaktype dat hier gebruikt worden ingesteld. Dit kan dus verschillen van de vaste bewaartermijn die de Samenwerkfunctionaliteit aanhoudt. In Open Zaak worden de documenten per actieverzoek, en niet — zoals in de Samenwerkfunctionaliteit — per samenwerking gegroepeerd. Zie de link hieronder om de lijst van documenten die zijn opgeslagen in te zien.';
  }
}
