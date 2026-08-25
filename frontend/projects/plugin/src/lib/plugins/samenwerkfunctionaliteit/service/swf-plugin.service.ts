import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SwfPluginClient } from '../client/swf-plugin-client.service';
import { SwfPluginProperties } from '../interface/sfw-properties.interface';
import { mapPluginPropertiesResponseDtoToModel } from '../mapper/plugin-properties.mapper';

@Injectable({
  providedIn: 'root',
})
export class SwfPluginService {
  private readonly swfPluginClient: SwfPluginClient = inject(SwfPluginClient);

  getSwfPluginProperties(): Observable<SwfPluginProperties> {
    return this.swfPluginClient
      .getSwfPluginProperties()
      .pipe(map((response) => mapPluginPropertiesResponseDtoToModel(response)));
  }
}
