import { Component } from '@angular/core';
import { SwfInformatiePaginaComponent } from '../../components/samenwerkingsinformatiepagina/swf-informatie-pagina/swf-informatie-pagina.component';

@Component({
  templateUrl: 'samenwerking-widget-tab.component.html',
  selector: 'samenwerking-widget-tab',
  imports: [SwfInformatiePaginaComponent],
  standalone: true,
})
export class SamenwerkingWidgetTabComponent {}
