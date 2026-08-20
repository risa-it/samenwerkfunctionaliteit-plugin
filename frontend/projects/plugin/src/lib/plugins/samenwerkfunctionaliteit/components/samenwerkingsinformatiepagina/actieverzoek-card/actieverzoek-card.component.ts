import { Component, input, InputSignal } from '@angular/core';
import { Actieverzoek } from '../../../models/actieverzoek.model';
import { DatePipe } from '@angular/common';
import { InputModule } from 'carbon-components-angular';
import { capitalize } from '../../../utils/capitalize';
import { TranslatePipe } from '@ngx-translate/core';
import { getActieverzoekTypeText } from '../../../types/actieverzoek-status.type';

@Component({
  selector: 'actieverzoek-card',
  imports: [DatePipe, InputModule, TranslatePipe],
  templateUrl: './actieverzoek-card.component.html',
  styleUrl: './actieverzoek-card.component.scss',
})
export class ActieverzoekCardComponent {
  actieverzoek: InputSignal<Actieverzoek> = input.required<Actieverzoek>();
  protected capitalize = capitalize;
  protected statusText: string = '';

  ngOnInit() {
    this.statusText = getActieverzoekTypeText(this.actieverzoek().status);
  }
}
