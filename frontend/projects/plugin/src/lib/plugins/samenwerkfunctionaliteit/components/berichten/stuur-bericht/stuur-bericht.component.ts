import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Send32 } from '@carbon/icons';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ButtonModule,
  IconModule,
  IconService,
  InputModule,
  NotificationModule,
} from 'carbon-components-angular';
import { NGXLogger } from 'ngx-logger';
import { finalize, take, tap } from 'rxjs';
import { BerichtNotification } from '../../../interface/bericht-notification.interface';
import { SwfCaseProperties } from '../../../interface/swf-case-properties.interface';
import { BerichtenService } from '../../../service/berichten.service';
import { SwfDocumentService } from '../../../service/swf-document.service';
import { UserNotificationService } from '../../../service/user-notification.service';
import { toBusinessKey } from '../../../types/business-key.type';

@Component({
  selector: 'stuur-bericht',
  imports: [
    InputModule,
    ButtonModule,
    IconModule,
    FormsModule,
    NotificationModule,
    CommonModule,
    TranslatePipe,
  ],

  templateUrl: './stuur-bericht.component.html',
  styleUrl: './stuur-bericht.component.scss',
})
export class StuurBerichtComponent {
  readonly pluginId = 'samenwerkfunctionaliteit';

  private actieverzoekId: string | null | undefined;

  notification = signal<BerichtNotification | null>(null);
  isSubmitting = signal(false);

  isLoading = input<boolean>(false);
  otherParticipant = input.required<string>();
  messageSent = output<void>();

  rows = 1;
  maxLength = 512;
  message = '';

  route = inject(ActivatedRoute);
  private berichtenService = inject(BerichtenService);
  private swfService = inject(SwfDocumentService);
  private readonly logger = inject(NGXLogger);
  private readonly iconService = inject(IconService);
  private readonly notificationService: UserNotificationService = inject(
    UserNotificationService,
  );

  ngOnInit() {
    this.iconService.registerAll([Send32]);
    const documentId = this.swfService.getParam(this.route, 'documentId');
    this.retrieveActieverzoekId(documentId);
  }

  onSend() {
    if (!this.actieverzoekId) {
      this.logger.warn('Unable to post message: No actieverzoekId available.');
      this.notificationService.showError({
        titleKey:
          'samenwerkfunctionaliteit.feedback.userNotification.messenger.fetchMessages.failure.title',
      });
      return;
    }
    this.isSubmitting.set(true);
    this.berichtenService
      .postBericht(this.actieverzoekId, this.message)
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.notificationService.showSuccess({
            titleKey:
              'samenwerkfunctionaliteit.feedback.userNotification.messenger.sendMessage.success.title',
            messageKey:
              'samenwerkfunctionaliteit.feedback.userNotification.messenger.sendMessage.success.message',
            messageParam: { otherParticipant: this.otherParticipant() },
          });
          this.message = '';
          this.messageSent.emit();
        },
        error: (response) => {
          this.logger.error(response);
          this.notificationService.showError({
            titleKey:
              'samenwerkfunctionaliteit.feedback.userNotification.messenger.sendMessage.failure.title',
          });
        },
      });
  }

  private retrieveActieverzoekId(documentId: string) {
    const businessKey = toBusinessKey(documentId);
    this.swfService
      .getSamenwerkingProperties(businessKey)
      .pipe(
        take(1),
        tap((props: SwfCaseProperties) => {
          if (props.actieverzoekId) {
            this.actieverzoekId = props.actieverzoekId;
          } else {
            throw new Error('Case is missing actieverzoekId.');
          }
        }),
      )
      .subscribe({
        error: (error) => {
          this.logger.error(
            'Unable to retrieve samenwerking properties',
            error,
          );

          this.notificationService.showError({
            titleKey:
              'samenwerkfunctionaliteit.feedback.userNotification.messenger.sendMessage.failure.title',
            messageKey:
              'samenwerkfunctionaliteit.feedback.userNotification.messenger.sendMessage.failure.failureMissingActieverzoekId',
          });
        },
      });
  }
}
