import { SwfPluginPropertiesResponse } from '../dto/swf-plugin-properties.dto';
import { SwfPluginProperties } from '../interface/sfw-properties.interface';

export function mapPluginPropertiesResponseDtoToModel(
  dto: SwfPluginPropertiesResponse,
): SwfPluginProperties {
  return {
    baseUrl: dto.baseUrl,
    oinNummer: dto.oinNummer,
    backupUploadsToDocumentenApi: dto.backupUploadsToDocumentenApi,
  };
}
