import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Collaborate32 } from '@carbon/icons';
import { IconModule, IconService } from 'carbon-components-angular';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { BerichtenListComponent } from '../../components/berichten/berichten-list/berichten-list.component';
import { StuurBerichtComponent } from '../../components/berichten/stuur-bericht/stuur-bericht.component';
import { Message } from '../../models/bericht.model';
import { SamenwerkingProperties } from '../../models/samenwerking-properties.model';
import { ActieverzoekService } from '../../service/actieverzoek.service';
import { BerichtenService } from '../../service/berichten.service';
import { SwfDocumentService } from '../../service/swf-document.service';
import { SwfPluginService } from '../../service/swf-plugin.service';
import { BusinessKey, toBusinessKey } from '../../types/business-key.type';
import { capitalize } from '../../utils/capitalize';

@Component({
  selector: 'berichten-custom-tab',
  imports: [StuurBerichtComponent, BerichtenListComponent, IconModule],
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

  messages: WritableSignal<Message[]> = signal<Message[]>([]);
  oinNumber: WritableSignal<string> = signal<string>('');
  hasError: WritableSignal<boolean> = signal<boolean>(false);
  errorMessage: WritableSignal<string> = signal<string>('');
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  otherParticipant: WritableSignal<string> = signal<string>('');

  samenwerkingProperties: SamenwerkingProperties;

  ngOnInit(): void {
    this.iconService.registerAll([Collaborate32]);
    this.getBerichten(this.getBusinessKey());

    this.isLoading.set(false);
  }

  protected refreshMessages(): void {
    this.isLoading.set(true);
    this.getBerichten(this.getBusinessKey());
    this.isLoading.set(false);
  }

  private getBusinessKey(): BusinessKey {
    const documentId = this.swfDocumentService.getParam(
      this.route,
      'documentId',
    );

    if (!documentId) {
      throw new Error('Could not retreive business key from the route');
    }

    return toBusinessKey(documentId);
  }

  private fetchSamenwerkingProperties(): Observable<SamenwerkingProperties> {
    return this.swfDocumentService
      .getSamenwerkingProperties(this.getBusinessKey())
      .pipe(
        tap((samenwerkingProperties: SamenwerkingProperties) => {
          if (!samenwerkingProperties.actieverzoekDetails.actieverzoekId) {
            throw Error('Dossier heeft geen actieverzoekId');
          }
          this.samenwerkingProperties = samenwerkingProperties;
        }),
      );
  }

  private getBerichten(businessKey: BusinessKey): void {
    this.fetchSamenwerkingProperties()
      .pipe(
        switchMap((samenwerkingProperties: SamenwerkingProperties) =>
          forkJoin({
            messages: this.berichtenService.getBerichten(
              samenwerkingProperties.actieverzoekDetails.actieverzoekId,
            ),
            otherParticipant: this.fetchOtherParticipant(
              samenwerkingProperties,
              businessKey,
            ),
          }),
        ),
        tap(({ messages }) => {
          this.messages.set(messages);
        }),
      )
      .subscribe({
        next: () => {
          this.hasError.set(false);
        },
        error: (error: Error) => {
          this.hasError.set(true);
          this.errorMessage.set(error.message);
        },
      });
  }

  private fetchOtherParticipant(
    samenwerkingProperties: SamenwerkingProperties,
    businessKey: BusinessKey,
  ): Observable<string> {
    return forkJoin({
      swfPluginProperties: this.swfPluginService.getSwfPluginProperties(),
      actieverzoek: this.actieverzoekService.getActieverzoek(
        samenwerkingProperties.actieverzoekDetails.actieverzoekId,
        businessKey,
      ),
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
