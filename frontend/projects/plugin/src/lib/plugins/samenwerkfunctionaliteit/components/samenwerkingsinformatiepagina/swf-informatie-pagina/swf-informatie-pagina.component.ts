import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { SamenwerkingsStatusComponent } from '../samenwerkingsstatus/samenwerkingsstatus.component';
import { SamenwerkingService } from '../../../service/samenwerking.service';
import {
  finalize,
  forkJoin,
  Observable,
  switchMap,
  take,
  takeWhile,
  tap,
} from 'rxjs';
import { Samenwerking } from '../../../models/samenwerking.model';
import { SamenwerkingComponent } from '../samenwerking/samenwerking.component';
import {
  ListItem,
  LoadingModule,
  NotificationModule,
} from 'carbon-components-angular';
import { NgClass } from '@angular/common';
import { DocumentListComponent } from '../../document-list/document-list.component';
import { SwfDocumentService } from '../../../service/swf-document.service';
import { ActivatedRoute } from '@angular/router';
import { BusinessKey, toBusinessKey } from '../../../types/business-key.type';
import { Actieverzoek } from '../../../models/actieverzoek.model';
import { ActieverzoekService } from '../../../service/actieverzoek.service';
import {
  ActieverzoekStatusList,
  ActieverzoekStatusType,
} from '../../../types/actieverzoek-status.type';
import { SamenwerkingProperties } from '../../../models/samenwerking-properties.model';
import { ActieverzoekCardComponent } from '../actieverzoek-card/actieverzoek-card.component';
import { UpdateStatusModalComponent } from '../update-status-modal/update-status-modal.component';
import {
  mapActieverzoekStatusToActieverzoekStatusType,
  mapLinkActionToActieverzoekStatus,
} from '../../../dto/actieverzoek.dto';
import { PluginTranslatePipeModule } from '@valtimo/plugin';
import { TranslatePipe } from '@ngx-translate/core';

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
        takeWhile((samenwerkingProps: SamenwerkingProperties) => {
          this.isSamenwerkingDossier.set(
            !!samenwerkingProps.actieverzoekDetails.actieverzoekId &&
              !!samenwerkingProps.samenwerkingId,
          );
          return this.isSamenwerkingDossier();
        }),
        switchMap((samenwerkingProps: SamenwerkingProperties) => {
          if (samenwerkingProps.actieverzoekDetails.actieverzoekId)
            return forkJoin({
              samenwerking: this.fetchSamenwerking(
                samenwerkingProps.samenwerkingId,
              ),
              actieverzoek: this.fetchActieverzoek(
                samenwerkingProps.actieverzoekDetails.actieverzoekId,
                businessKey,
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
    actieverzoekId: string,
    businessKey: BusinessKey,
  ): Observable<Actieverzoek> {
    return this.actieverzoekService
      .getActieverzoek(actieverzoekId, businessKey)
      .pipe(take(1));
  }

  private mapActieverzoekStatusTypesToListItems(
    actieverzoekStatusTypes: ActieverzoekStatusType[],
  ): ListItem[] {
    return actieverzoekStatusTypes.map(
      (actieverzoekStatusType: ActieverzoekStatusType): ListItem => {
        return {
          content: actieverzoekStatusType,
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
