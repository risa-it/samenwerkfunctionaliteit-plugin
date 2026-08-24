import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IconModule } from 'carbon-components-angular';
import { Message } from '../../../models/bericht.model';
import { BerichtComponent } from './bericht/bericht.component';

@Component({
  selector: 'berichten-list',
  imports: [BerichtComponent, IconModule, TranslatePipe],
  templateUrl: './berichten-list.component.html',
  styleUrl: './berichten-list.component.scss',
})
export class BerichtenListComponent {
  oinNumber: InputSignal<string> = input.required<string>();
  messages: InputSignal<Message[]> = input.required<Message[]>();
  isLoading: InputSignal<boolean> = input.required<boolean>();
  sortedMessages: Signal<Message[]> = computed((): Message[] => {
    return [...this.messages()].sort(
      (a, b) => a.createdOn.getTime() - b.createdOn.getTime(),
    );
  });
}
