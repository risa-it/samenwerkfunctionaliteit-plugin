import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { NotificatieService } from '../../service/notificatie.service';
import { Observable, switchMap, take } from 'rxjs';
import { Notificatie, NotificatiePage } from '../../models/notificatie.model';
import {
  LoadingModule,
  PaginationModule,
  SkeletonModule,
} from 'carbon-components-angular';
import { SwfDocumentService } from '../../service/swf-document.service';
import { ActivatedRoute } from '@angular/router';
import { NotificatieCardInput } from './model/notificatie-card-input.model';
import { CardInput } from './interface/card-input.interface';
import { NotificatieType, NotificatieTypes } from './type/notificatie.type';
import {
  NotificatieCardType,
  NotificatieCardTypes,
} from './type/notificatie-card.type';
import { NotificatieCardComponent } from './notificatie-card/notificatie-card.component';
import { toBusinessKey } from '../../types/business-key.type';
import { PaginationComponent } from './notification-card-list-pagination/swf-pagination.component';

@Component({
  templateUrl: `notificatie-card-list.component.html`,
  styleUrl: './notificatie-card-list.component.scss',
  imports: [
    NotificatieCardComponent,
    LoadingModule,
    SkeletonModule,
    PaginationModule,
    PaginationComponent,
  ],
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

  documentId: string = '';
  FIRST_PAGE: number = 1;

  readonly page = signal(this.FIRST_PAGE);
  readonly pageSize = signal(this.itemsPerPage);
  readonly totalNotifications = signal(0);

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetchAndLoadNotifications(
      this.documentId,
      this.page(),
      this.pageSize(),
    );
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize.set(pageSize);
    this.page.set(1);

    this.fetchAndLoadNotifications(
      this.documentId,
      this.page(),
      this.pageSize(),
    );
  }

  ngOnInit() {
    this.documentId = this.swfDocumentService.getParam(
      this.route,
      'documentId',
    );
    if (this.documentId !== null) {
      this.fetchAndLoadNotifications(
        this.documentId,
        this.FIRST_PAGE,
        this.pageSize(),
      );
    }
  }

  private fetchAndLoadNotifications(
    documentId: string,
    page: number,
    size: number,
  ): void {
    const businessKey = toBusinessKey(documentId);

    this.swfDocumentService
      .getSamenwerkingProperties(businessKey)
      .pipe(
        take(1),
        switchMap((samenwerkingProperties) => {
          return this.fetchNotifications(
            samenwerkingProperties.samenwerkingId,
            page,
            size,
          );
        }),
      )
      .subscribe((notificatie) => {
        this.notifications.set(notificatie.page.item);
        this.page.set(notificatie.page.number);
        this.pageSize.set(notificatie.page.size);
        this.totalNotifications.set(notificatie.page.totalElements);
        this.loadInputs(this.notifications());
      });
  }

  private fetchNotifications(
    samenwerkingId: string,
    page: number,
    size: number,
  ): Observable<NotificatiePage> {
    return this.notificatieService.getNotificaties(samenwerkingId, page, size);
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
