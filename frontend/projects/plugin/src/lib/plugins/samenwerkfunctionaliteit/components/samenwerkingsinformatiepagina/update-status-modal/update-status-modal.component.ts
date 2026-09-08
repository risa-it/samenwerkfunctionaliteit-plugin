import {
  Component,
  inject,
  input,
  InputSignal,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  Actieverzoek,
  ActieverzoekUpdateData,
} from '../../../models/actieverzoek.model';
import { FormsModule } from '@angular/forms';
import {
  ButtonModule,
  DropdownModule,
  IconModule,
  InputModule,
} from 'carbon-components-angular';
import { ActieverzoekService } from '../../../service/actieverzoek.service';
import {
  ActieverzoekStatusType,
  ActieverzoekStatusTypeOption,
} from '../../../types/actieverzoek-status.type';
import { UserNotificationService } from '../../../service/user-notification.service';
import { UserNotification } from '../../../interface/user-notification.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'update-status-modal',
  imports: [
    FormsModule,
    DropdownModule,
    InputModule,
    ButtonModule,
    IconModule,
    TranslatePipe,
  ],
  templateUrl: './update-status-modal.component.html',
  styleUrl: './update-status-modal.component.scss',
})
export class UpdateStatusModalComponent {
  private readonly actieverzoekService: ActieverzoekService =
    inject(ActieverzoekService);
  private readonly userNotificatieService: UserNotificationService = inject(
    UserNotificationService,
  );
  actieverzoek: InputSignal<Actieverzoek> = input.required<Actieverzoek>();
  allowedStatusTypes: InputSignal<ActieverzoekStatusTypeOption[]> =
    input.required<ActieverzoekStatusTypeOption[]>();
  hasError: WritableSignal<boolean> = signal<boolean>(false);
  isSending: WritableSignal<boolean> = signal<boolean>(false);
  onStatusChanged = output<void>();

  updateStatus: ActieverzoekStatusType | undefined = undefined;
  explanation: string = '';

  protected onSubmit() {
    if (!this.updateStatus && !this.explanation) {
      return;
    }
    const actieverzoekUpdateData: ActieverzoekUpdateData =
      this.createActieverzoekUpdateDataFrom(this.actieverzoek());
    this.updateActieverzoekStatus(actieverzoekUpdateData);
  }

  private createActieverzoekUpdateDataFrom(
    actieverzoek: Actieverzoek,
  ): ActieverzoekUpdateData {
    return {
      notice: this.explanation,
      description: actieverzoek.description,
      productId: actieverzoek.productId,
      status: this.updateStatus,
      title: actieverzoek.title,
    };
  }

  private updateActieverzoekStatus(
    actieverzoekUpdateData: ActieverzoekUpdateData,
  ): void {
    this.isSending.set(true);

    this.actieverzoekService
      .updateActieverzoekStatus(
        this.actieverzoek().actieverzoekId,
        actieverzoekUpdateData,
      )
      .pipe(
        take(1),
        finalize(() => {
          this.isSending.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.showSuccessNotification();
          this.updateStatus = undefined;
          this.explanation = '';
          this.onStatusChanged.emit();
        },
        error: (error: Error) => {
          this.hasError.set(true);
          this.showFailedNotification();
        },
      });
  }

  private showSuccessNotification(): void {
    const notification: UserNotification = {
      titleKey:
        'samenwerkfunctionaliteit.actieverzoekStatusUpdate.successTitle',
      messageKey:
        'samenwerkfunctionaliteit.actieverzoekStatusUpdate.successMessage',
      messageParam: {
        name: this.actieverzoek().title,
        status: this.updateStatus,
      },
    };

    this.userNotificatieService.showSuccess(notification);
  }

  private showFailedNotification(): void {
    const notification: UserNotification = {
      titleKey: 'samenwerkfunctionaliteit.actieverzoekStatusUpdate.failedTitle',
      messageKey:
        'samenwerkfunctionaliteit.actieverzoekStatusUpdate.failedMessage',
    };

    this.userNotificatieService.showError(notification);
  }
}
