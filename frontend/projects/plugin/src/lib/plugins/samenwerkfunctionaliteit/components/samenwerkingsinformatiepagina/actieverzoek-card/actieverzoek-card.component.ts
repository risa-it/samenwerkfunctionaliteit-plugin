import { Component, input, InputSignal } from '@angular/core';
import { Actieverzoek } from '../../../models/actieverzoek.model';
import { DatePipe } from '@angular/common';
import { InputModule } from 'carbon-components-angular';
import { capitalize } from '../../../utils/capitalize';
import { ActieverzoekStatusTypes } from '../../../types/actieverzoek-status.type';
import { TranslatePipe } from '@ngx-translate/core';

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
    this.statusText = this.getTypeText();
  }

  private getTypeText() {
    switch (this.actieverzoek().status) {
      case ActieverzoekStatusTypes.Open:
        return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.open';
      case ActieverzoekStatusTypes.InProgress:
        return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.inProgress';
      case ActieverzoekStatusTypes.Rejected:
        return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.rejected';
      case ActieverzoekStatusTypes.Withdrawn:
        return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.withdrawn';
      case ActieverzoekStatusTypes.ReportedReady:
        return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.reportedReady';
      case ActieverzoekStatusTypes.Ready:
        return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.ready';
      default:
        throw Error('Unknown actieverzoek status type');
    }
  }
}
