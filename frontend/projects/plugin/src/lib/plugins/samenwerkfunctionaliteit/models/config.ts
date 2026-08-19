import {PluginConfigurationData} from '@valtimo/plugin';

interface Config extends PluginConfigurationData {
  baseUrl: string;
  certificate: string;
  oinNummer: string;
}

export {Config};
