import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PluginTranslatePipeModule } from '@valtimo/plugin';
import {
  ListItem,
  LoadingModule,
  NotificationModule,
} from 'carbon-components-angular';
import {
  finalize,
  forkJoin,
  Observable,
  switchMap,
  take,
  takeWhile,
  tap,
} from 'rxjs';
import {
  mapActieverzoekStatusToActieverzoekStatusType,
  mapLinkActionToActieverzoekStatus,
} from '../../../dto/actieverzoek.dto';
import { SwfCaseProperties } from '../../../interface/swf-case-properties.interface';
import { Actieverzoek } from '../../../models/actieverzoek.model';
import { Samenwerking } from '../../../models/samenwerking.model';
import { ActieverzoekService } from '../../../service/actieverzoek.service';
import { SamenwerkingService } from '../../../service/samenwerking.service';
import { SwfDocumentService } from '../../../service/swf-document.service';
import { ActieverzoekId } from '../../../types/actieverzoek-id.type';
import {
  ActieverzoekStatusList,
  ActieverzoekStatusType,
  getActieverzoekTypeText,
} from '../../../types/actieverzoek-status.type';
import { BusinessKey, toBusinessKey } from '../../../types/business-key.type';
import { DocumentListComponent } from '../../document-list/document-list.component';
import { ActieverzoekCardComponent } from '../actieverzoek-card/actieverzoek-card.component';
import { SamenwerkingComponent } from '../samenwerking/samenwerking.component';
import { SamenwerkingsStatusComponent } from '../samenwerkingsstatus/samenwerkingsstatus.component';
import { UpdateStatusModalComponent } from '../update-status-modal/update-status-modal.component';

@Component({
  selector: 'swf-informatie-pagina',
  templateUrl: './swf-informatie-pagina.component.html',
  standalone: true,
  imports: [
    SamenwerkingsStatusComponent,
    SamenwerkingComponent,
    LoadingModule,
    NgClass,
    DocumentListComponent,
    ActieverzoekCardComponent,
    UpdateStatusModalComponent,
    NotificationModule,
    PluginTranslatePipeModule,
    TranslatePipe,
  ],
  styleUrl: './swf-informatie-pagina.component.scss',
})
export class SwfInformatiePaginaComponent implements OnInit {
  samenwerkingService = inject(SamenwerkingService);
  swfDocumentService = inject(SwfDocumentService);
  actieverzoekService = inject(ActieverzoekService);
  translateService = inject(TranslateService);
  route = inject(ActivatedRoute);

  samenwerking: WritableSignal<Samenwerking> = signal(null);
  isSamenwerkingDossier: WritableSignal<boolean> = signal(false);
  actieverzoek: WritableSignal<Actieverzoek> = signal(null);
  actieverzoekStatusTypes: WritableSignal<ActieverzoekStatusType[]> = signal(
    ActieverzoekStatusList,
  );
  isLoading: WritableSignal<boolean> = signal(true);
  statusTypeDropdownListItems: Signal<ListItem[]> = computed(() => {
    const actieverzoekStatusTypesList = this.actieverzoekStatusTypes();
    return this.mapActieverzoekStatusTypesToListItems(
      actieverzoekStatusTypesList,
    );
  });

  ngOnInit() {
    const documentId = this.swfDocumentService.getParam(
      this.route,
      'documentId',
    );
    const businessKey = toBusinessKey(documentId);

    this.fetchAndLoadSamenwerking(businessKey);
  }

  private fetchAndLoadSamenwerking(businessKey: BusinessKey): void {
    this.swfDocumentService
      .getSamenwerkingProperties(businessKey)
      .pipe(
        takeWhile((samenwerkingProps) => {
          this.isSamenwerkingDossier.set(
            !!samenwerkingProps.actieverzoekId &&
              !!samenwerkingProps.samenwerkingId,
          );
          return this.isSamenwerkingDossier();
        }),
        switchMap((samenwerkingProps: SwfCaseProperties) => {
          if (samenwerkingProps.actieverzoekId)
            return forkJoin({
              samenwerking: this.fetchSamenwerking(
                samenwerkingProps.samenwerkingId,
              ),
              actieverzoek: this.fetchActieverzoek(
                samenwerkingProps.actieverzoekDetails.actieverzoekId,
              ),
            });
        }),
        tap(({ samenwerking, actieverzoek }) => {
          this.updateActieverzoekStatusTypes(actieverzoek);
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: ({ samenwerking, actieverzoek }) => {
          this.samenwerking.set(samenwerking);
          this.actieverzoek.set(actieverzoek);
        },
      });
  }

  private updateActieverzoekStatusTypes(actieverzoek: Actieverzoek) {
    // TODO expand link actions to include sender, keys are only for receiver at the moment.
    if (actieverzoek.links) {
      const keys: string[] = Object.keys(actieverzoek.links);

      this.actieverzoekStatusTypes.update(
        (statusTypes): ActieverzoekStatusType[] => {
          const mappedKeys = keys
            .filter(this.isNonStatusTypes)
            .map(this.keyToActieverzoekStatusType);
          return statusTypes.filter((statusType) => {
            return mappedKeys.includes(statusType);
          });
        },
      );
    }
  }

  private fetchSamenwerking(samenwerkingId: string): Observable<Samenwerking> {
    return this.samenwerkingService
      .getSamenwerking(samenwerkingId)
      .pipe(take(1));
  }

  private fetchActieverzoek(
    actieverzoekId: ActieverzoekId,
  ): Observable<Actieverzoek> {
    return this.actieverzoekService
      .getActieverzoek(actieverzoekId)
      .pipe(take(1));
  }

  private mapActieverzoekStatusTypesToListItems(
    actieverzoekStatusTypes: ActieverzoekStatusType[],
  ): ListItem[] {
    return actieverzoekStatusTypes.map(
      (actieverzoekStatusType: ActieverzoekStatusType): ListItem => {
        const translatedType = this.translateService.instant(
          getActieverzoekTypeText(actieverzoekStatusType),
        );
        return {
          content: translatedType,
          value: actieverzoekStatusType,
          selected: false,
        };
      },
    );
  }

  private isNonStatusTypes(key: string): boolean {
    return key !== 'self' && key !== 'berichtVerzenden';
  }

  private keyToActieverzoekStatusType(
    linkAction: string,
  ): ActieverzoekStatusType {
    return mapActieverzoekStatusToActieverzoekStatusType(
      mapLinkActionToActieverzoekStatus(linkAction),
    );
  }
}
