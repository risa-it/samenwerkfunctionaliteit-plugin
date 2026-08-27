import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingModule, SkeletonModule } from 'carbon-components-angular';
import { Observable, switchMap, take } from 'rxjs';
import { Notificatie } from '../../models/notificatie.model';
import { NotificatieService } from '../../service/notificatie.service';
import { SwfDocumentService } from '../../service/swf-document.service';
import { toBusinessKey } from '../../types/business-key.type';
import { CardInput } from './interface/card-input.interface';
import { NotificatieCardInput } from './model/notificatie-card-input.model';
import { NotificatieCardComponent } from './notificatie-card/notificatie-card.component';
import {
  NotificatieCardType,
  NotificatieCardTypes,
} from './type/notificatie-card.type';
import { NotificatieType, NotificatieTypes } from './type/notificatie.type';

@Component({
  templateUrl: `notificatie-card-list.component.html`,
  styleUrl: './notificatie-card-list.component.scss',
  imports: [NotificatieCardComponent, LoadingModule, SkeletonModule],
  selector: 'swf-notificatie-card-list',
})
export class NotificatieCardListComponent implements OnInit {
  notificatieService: NotificatieService = inject(NotificatieService);
  swfDocumentService: SwfDocumentService = inject(SwfDocumentService);
  route: ActivatedRoute = inject(ActivatedRoute);
  notifications: WritableSignal<Notificatie[]> = signal<Notificatie[]>([]);
  inputs: WritableSignal<CardInput[]> = signal<CardInput[]>([]);
  skeletonInput = {
    ...new NotificatieCardInput(),
    type: NotificatieCardTypes.Skeleton,
  };
  isLoading: WritableSignal<boolean> = signal(true);
  itemsPerPage = 10;
  itemsPerPageArray: number[] = Array.from({ length: this.itemsPerPage });

  ngOnInit() {
    const documentId = this.swfDocumentService.getParam(
      this.route,
      'documentId',
    );
    if (documentId !== null) {
      this.fetchAndLoadNotifications(documentId);
    }
  }

  private fetchAndLoadNotifications(documentId: string): void {
    const businessKey = toBusinessKey(documentId);

    this.swfDocumentService
      .getSamenwerkingProperties(businessKey)
      .pipe(
        take(1),
        switchMap((samenwerkingProperties) => {
          return this.fetchNotifications(samenwerkingProperties.samenwerkingId);
        }),
      )
      .subscribe((notificaties) => {
        this.notifications.set(notificaties);
        this.loadInputs(this.notifications());
      });
  }

  private fetchNotifications(
    samenwerkingId: string,
  ): Observable<Notificatie[]> {
    return this.notificatieService
      .getNotificaties(samenwerkingId)
      .pipe(take(1));
  }

  private loadInputs(notificaties: Notificatie[]): void {
    this.inputs.set(
      notificaties.map((notificatie) => {
        return this.mapNotificatieToNotificatieCardInput(notificatie);
      }),
    );
    this.isLoading.set(false);
  }

  private mapNotificatieToNotificatieCardInput(
    notificatie: Notificatie,
  ): CardInput {
    return new NotificatieCardInput(
      notificatie.notificatieId,
      this.mapNotificatieTypeToNotificatieCardType(notificatie.notificatieType),
      notificatie.notificatieTitel,
      notificatie.eventDateTime,
      notificatie.eventInitiatorName,
      notificatie.notificatieText,
    );
  }

  private mapNotificatieTypeToNotificatieCardType(
    notificatieType: NotificatieType,
  ): NotificatieCardType {
    switch (notificatieType) {
      case NotificatieTypes.ActieverzoekStatusChanged:
        return NotificatieCardTypes.Status;
      case NotificatieTypes.DocumentCreated:
        return NotificatieCardTypes.Document;
      case NotificatieTypes.DocumentDeleted:
        return NotificatieCardTypes.Document;
      case NotificatieTypes.DocumentEdited:
        return NotificatieCardTypes.Document;
      case NotificatieTypes.InvitationPartnerOrganization:
        return NotificatieCardTypes.System;
      case NotificatieTypes.MessageSent:
        return NotificatieCardTypes.Message;
      case NotificatieTypes.RequestRetrievalSucceeded:
        return NotificatieCardTypes.System;
      case NotificatieTypes.Skeleton:
        return NotificatieCardTypes.Skeleton;

      default:
        throw new Error(`Unknown notificatie type: ${notificatieType}`);
    }
  }
}
