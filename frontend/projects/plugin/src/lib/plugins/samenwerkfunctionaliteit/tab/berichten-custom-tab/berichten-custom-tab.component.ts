import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Collaborate32 } from '@carbon/icons';
import { TranslatePipe } from '@ngx-translate/core';
import {
  IconModule,
  IconService,
  NotificationModule,
} from 'carbon-components-angular';
import { EMPTY, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BerichtenListComponent } from '../../components/berichten/berichten-list/berichten-list.component';
import { StuurBerichtComponent } from '../../components/berichten/stuur-bericht/stuur-bericht.component';
import { SwfCaseProperties } from '../../interface/swf-case-properties.interface';
import { Message } from '../../models/bericht.model';
import { ActieverzoekService } from '../../service/actieverzoek.service';
import { BerichtenService } from '../../service/berichten.service';
import { SwfDocumentService } from '../../service/swf-document.service';
import { SwfPluginService } from '../../service/swf-plugin.service';
import { UserNotificationService } from '../../service/user-notification.service';
import { ActieverzoekId } from '../../types/actieverzoek-id.type';
import { BusinessKey, toBusinessKey } from '../../types/business-key.type';
import { capitalize } from '../../utils/capitalize';

@Component({
  selector: 'berichten-custom-tab',
  imports: [
    StuurBerichtComponent,
    BerichtenListComponent,
    IconModule,
    NotificationModule,
    TranslatePipe,
  ],
  templateUrl: './berichten-custom-tab.component.html',
  styleUrl: './berichten-custom-tab.component.css',
})
export class BerichtenCustomTabComponent implements OnInit {
  private readonly berichtenService: BerichtenService =
    inject(BerichtenService);
  private readonly swfDocumentService: SwfDocumentService =
    inject(SwfDocumentService);
  private readonly actieverzoekService: ActieverzoekService =
    inject(ActieverzoekService);
  private readonly swfPluginService: SwfPluginService =
    inject(SwfPluginService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly iconService: IconService = inject(IconService);
  private readonly notificationService: UserNotificationService = inject(
    UserNotificationService,
  );

  messages: WritableSignal<Message[]> = signal<Message[]>([]);
  oinNumber: WritableSignal<string> = signal<string>('');
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  otherParticipant: WritableSignal<string> = signal<string>('');
  isSamenwerkingDossier: WritableSignal<boolean> = signal<boolean>(false);

  swfCaseProperties: SwfCaseProperties;

  ngOnInit(): void {
    this.iconService.registerAll([Collaborate32]);

    this.fetchChat();
  }

  protected refreshMessages(): void {
    this.fetchChat();
  }

  private getBusinessKey(): BusinessKey {
    const documentId = this.swfDocumentService.getParam(
      this.route,
      'documentId',
    );

    if (!documentId) {
      throw new Error('Could not retrieve business key from the route');
    }

    return toBusinessKey(documentId);
  }

  private fetchSamenwerkingProperties(): Observable<SwfCaseProperties> {
    return this.swfDocumentService
      .getSamenwerkingProperties(this.getBusinessKey())
      .pipe(
        tap((swfCaseProperties: SwfCaseProperties) => {
          this.isSamenwerkingDossier.set(swfCaseProperties.isSwfCase);
          this.swfCaseProperties = swfCaseProperties;
        }),
      );
  }

  private fetchChat(): void {
    this.isLoading.set(true);

    this.swfDocumentService
      .getIsSamenwerkingCase(this.getBusinessKey())
      .pipe(
        switchMap((isSamenwerkingCase) => {
          if (!isSamenwerkingCase) {
            return of(null);
          }

          return this.fetchSamenwerkingProperties();
        }),
        switchMap((swfCaseProperties) => {
          if (!swfCaseProperties) {
            return of(null);
          }

          return forkJoin({
            messages: this.berichtenService.getBerichten(
              swfCaseProperties.actieverzoekId,
            ),
            otherParticipant: this.fetchOtherParticipant(
              swfCaseProperties.actieverzoekId,
            ),
          });
        }),
        tap((result) => {
          if (result) {
            this.messages.set(result.messages);
          }

          this.isLoading.set(false);
        }),
        catchError((error) => {
          console.error('Error fetching chat messages:', error);

          this.notificationService.showError({
            titleKey:
              'samenwerkfunctionaliteit.feedback.userNotification.messenger.fetchMessages.failure.title',
          });

          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private fetchOtherParticipant(
    actieverzoekId: ActieverzoekId,
  ): Observable<string> {
    return forkJoin({
      swfPluginProperties: this.swfPluginService.getSwfPluginProperties(),
      actieverzoek: this.actieverzoekService.getActieverzoek(actieverzoekId),
    }).pipe(
      tap(({ swfPluginProperties }) => {
        this.oinNumber.set(swfPluginProperties.oinNummer);
      }),
      map(({ swfPluginProperties, actieverzoek }) => {
        return capitalize(
          swfPluginProperties.oinNummer !== actieverzoek.sender
            ? actieverzoek.senderName
            : actieverzoek.receiverName,
        );
      }),
      tap((receiver: string) => {
        this.otherParticipant.set(receiver);
      }),
    );
  }
}
