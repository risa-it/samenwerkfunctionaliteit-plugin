import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'carbon-components-angular';
import { capitalize } from '../../../utils/capitalize';
import { NotificatieCardInterface } from '../interface/notificatie-card.interface';
import { NotificatieCardInput } from '../model/notificatie-card-input.model';
import { NotificatieCardTypes } from '../type/notificatie-card.type';

@Component({
  templateUrl: './notificatie-card.component.html',
  styleUrls: ['./notificatie-card.component.scss'],
  selector: 'swf-notificatie-card',
  imports: [TranslatePipe, SkeletonModule, DatePipe],
})
export class NotificatieCardComponent
  implements OnInit, NotificatieCardInterface
{
  protected translate = inject(TranslateService);

  inputs = input<NotificatieCardInput>({
    ...new NotificatieCardInput(),
    type: NotificatieCardTypes.Skeleton,
  });

  protected capitalizedContent: Signal<string> = computed(() =>
    capitalize(this.inputs().content),
  );
  protected isSkeleton = computed(
    () => this.inputs().type === NotificatieCardTypes.Skeleton,
  );
  protected cardClass: string = '';
  protected typeText: string = '';

  ngOnInit() {
    this.cardClass = this.inputs().type?.toLowerCase() ?? '';
    this.typeText = this.getTypeText();
  }

  private getTypeText() {
    switch (this.inputs().type) {
      case NotificatieCardTypes.Document:
        return 'samenwerkfunctionaliteit.types.notification.document';
      case NotificatieCardTypes.Message:
        return 'samenwerkfunctionaliteit.types.notification.message';
      case NotificatieCardTypes.Status:
        return 'samenwerkfunctionaliteit.types.notification.status';
      case NotificatieCardTypes.System:
        return 'samenwerkfunctionaliteit.types.notification.system';
      default:
        return '';
    }
  }
}
