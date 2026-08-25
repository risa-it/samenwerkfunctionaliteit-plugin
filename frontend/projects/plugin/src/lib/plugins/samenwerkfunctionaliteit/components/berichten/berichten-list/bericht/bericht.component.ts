import {
  Component,
  inject,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../../../models/bericht.model';

@Component({
  selector: 'swf-bericht',
  imports: [],
  templateUrl: './bericht.component.html',
  styleUrl: './bericht.component.scss',
})
export class BerichtComponent {
  private readonly translateService: TranslateService =
    inject(TranslateService);
  message: InputSignal<Message> = input.required<Message>();
  oinNumber: InputSignal<string> = input.required<string>();
  isSentByCurrentParticipant: WritableSignal<boolean> = signal(false);
  formattedDate: string = '';

  ngOnInit() {
    this.setIsSentByCurrentParticipant();
    this.formattedDate = this.getFormattedDate(this.message().createdOn);
  }

  private setIsSentByCurrentParticipant(): void {
    this.isSentByCurrentParticipant.set(
      this.oinNumber() === this.message().sender,
    );
  }

  private getFormattedDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) {
      return this.translateService.instant(
        'samenwerkfunctionaliteit.messages.dateTimeStamp.justNow',
      );
    }

    if (diffMinutes < 60) {
      return this.translateService.instant(
        diffMinutes === 1
          ? 'samenwerkfunctionaliteit.messages.dateTimeStamp.minuteSingular'
          : 'samenwerkfunctionaliteit.messages.dateTimeStamp.minutePlural',
        {
          minuteCount: diffMinutes,
        },
      );
    }

    if (date.getDate() === now.getDate()) {
      return (
        this.translateService.instant(
          'samenwerkfunctionaliteit.messages.dateTimeStamp.today',
        ) +
        `, ${new Intl.DateTimeFormat(this.translateService.currentLang, {
          timeStyle: 'short',
        }).format(date)}`
      );
    }

    return new Intl.DateTimeFormat(this.translateService.currentLang, {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(date);
  }
}
