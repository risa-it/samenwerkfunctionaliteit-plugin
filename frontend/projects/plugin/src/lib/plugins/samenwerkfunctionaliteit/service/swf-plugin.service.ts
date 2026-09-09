import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { SwfPluginClient } from '../client/swf-plugin.client';
import { SwfPluginProperties } from '../interface/sfw-properties.interface';
import { mapPluginPropertiesResponseDtoToModel } from '../mapper/plugin-properties.mapper';

@Injectable({
  providedIn: 'root',
})
export class SwfPluginService {
  private readonly swfPluginClient: SwfPluginClient = inject(SwfPluginClient);

  private properties: SwfPluginProperties | undefined;

  getSwfPluginProperties(): Observable<SwfPluginProperties> {
    if (this.properties) {
      return of(this.properties);
    }

    return this.swfPluginClient
      .getSwfPluginProperties()
      .pipe(
        map((response) => mapPluginPropertiesResponseDtoToModel(response)),
        tap((properties) => (this.properties = properties))
      );
  }
}
