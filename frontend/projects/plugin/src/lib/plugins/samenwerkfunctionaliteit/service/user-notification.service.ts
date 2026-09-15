import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalNotificationService } from '@valtimo/shared';
import { UserNotification } from '../interface/user-notification.interface';

@Injectable({ providedIn: 'root' })
export class UserNotificationService {
  private readonly notificationService: GlobalNotificationService = inject(
    GlobalNotificationService,
  );
  private readonly translateService: TranslateService =
    inject(TranslateService);

  private readonly ERROR_MESSAGE_DURATION_IN_MS: number = 20000;
  private readonly SUCCESS_MESSAGE_DURATION_IN_MS: number = 8000;

  showError(notification: UserNotification): void {
    const title = this.translateService.instant(
      notification.titleKey ??
      'samenwerkfunctionaliteit.feedback.userNotification.generic.failure.title',
      notification.titleParam,
    );

    const message = this.translateService.instant(
      notification.messageKey ??
      'samenwerkfunctionaliteit.feedback.userNotification.generic.failure.message',
      notification.messageParam,
    );

    this.notificationService.showNotification({
      type: 'error',
      title,
      message,
      duration: this.ERROR_MESSAGE_DURATION_IN_MS,
      showClose: true,
    });
  }

  showSuccess(notification: UserNotification): void {
    const title = this.translateService.instant(
      notification.titleKey ??
      'samenwerkfunctionaliteit.feedback.userNotification.generic.success.title',
      notification.titleParam,
    );

    const message = this.translateService.instant(
      notification.messageKey ??
      'samenwerkfunctionaliteit.feedback.userNotification.generic.success.message',
      notification.messageParam,
    );

    this.notificationService.showNotification({
      type: 'success',
      title,
      message,
      duration: this.SUCCESS_MESSAGE_DURATION_IN_MS,
      showClose: true,
    });
  }
}
