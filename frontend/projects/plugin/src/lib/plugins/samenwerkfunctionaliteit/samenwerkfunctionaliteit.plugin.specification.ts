import { PluginSpecification } from '@valtimo/plugin';
import { SAMENWERKFUNCTIONALITEIT_PLUGIN_LOGO_BASE64 } from './assets/samenwerkfunctionaliteit-plugin-logo';
import { DeleteBerichtComponent } from './components/delete-bericht/delete-bericht.component';
import { DownloadDocumentComponent } from './components/download-document/download-document.component';
import { GetActieverzoekComponent } from './components/get-actieverzoek/get-actieverzoek.component';
import { GetAllActieverzoekenComponent } from './components/get-all-actieverzoeken/get-all-actieverzoeken.component';
import { GetBerichtComponent } from './components/get-bericht/get-bericht.component';
import { GetDocumentenOverzichtComponent } from './components/get-documenten-overzicht/get-documenten-overzicht.component';
import { GetSamenwerkingNotificatiesComponent } from './components/get-samenwerking-notificaties/get-samenwerking-notificaties.component';
import { PostBerichtComponent } from './components/post-bericht/post-bericht.component';
import { SamenwerkfunctionaliteitPluginConfigurationComponent } from './components/samenwerkfunctionaliteit-plugin-configuration/samenwerkfunctionaliteit-plugin-configuration.component';
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';

const samenwerkfunctionaliteitPluginSpecification: PluginSpecification = {
  pluginId: 'samenwerkfunctionaliteit',
  pluginConfigurationComponent:
    SamenwerkfunctionaliteitPluginConfigurationComponent,
  pluginLogoBase64: SAMENWERKFUNCTIONALITEIT_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'get-actieverzoek': GetActieverzoekComponent,
    'get-all-actieverzoeken': GetAllActieverzoekenComponent,
    'get-bericht': GetBerichtComponent,
    'post-bericht': PostBerichtComponent,
    'delete-bericht': DeleteBerichtComponent,
    'get-documentenoverzicht': GetDocumentenOverzichtComponent,
    'download-document': DownloadDocumentComponent,
    'upload-document': UploadDocumentComponent,
    'get-samenwerking-notificaties': GetSamenwerkingNotificatiesComponent,
  },
  pluginTranslations: {
    nl: {
      title: 'Samenwerkfunctionaliteit',
      configurationTitle: 'Configuratie van de Samenwerkfunctionaliteit-plugin',
      description:
        'Een plugin voor het verwerken van gegevens binnen de Samenwerkfunctionaliteit-API binnen het Digitaal Stelsel Omgevingswet (DSO).',
      configurationTitleTooltip:
        'In dit onderdeel configureer je de Samenwerkfunctionaliteit-plugin om eenvoudig gegevens te kunnen verzenden en ophalen.',
      certificate: 'Certificaat',
      oinNummer: 'OIN-Nummer',

      // Get Documents:
      'get-documentenoverzicht': 'Documenten overzicht ophalen',
      resultPvName: 'Naam van resultaat-procesvariabele',
      samenwerkingId: 'Samenwerking-ID',
      aangemaaktDoor: 'Aangemaakt door',
      negateAangemaaktDoor: 'Aangemaakt door uitsluiten',
      aangemaaktDoorNaam: 'Aangemaakt door naam',
      negateAangemaaktDoorNaam: 'Aangemaakt door naam uitsluiten',
      sort: 'Sortering',
      aantal: 'Aantal resultaten',
      pagina: 'Pagina',

      variableFieldTooltip:
        "Dit veld kan zowel de letterlijke waarde, of het pad naar een (proces)variabele bevatten welke de waarde bevat (b.v. 'pv:/resultaat')",
      samenwerkfunctionaliteitUrl: 'Samenwerkfunctionaliteit-URL',

      // Pluginacties

      // Actieverzoeken
      // Haal een specifiek actieverzoek op
      'get-actieverzoek': 'Actieverzoek ophalen',
      actieverzoekId: 'Het actieverzoekId van dit actieverzoek',

      // Haal alle actieverzoeken op
      'get-all-actieverzoeken': 'Alle actieverzoeken ophalen',
      isOrganisationTheReceiverTooltip:
        'Filtert op actieverzoeken waarvan de huidige organisatie (zie OIN in de instellingen van de plugin) de ontvanger is.',
      isOrganisationTheReceiver:
        'De actieverzoeken filteren op organisatie, die gedefinieerd is in the plugin configuratie.',

      // Haal alle notificaties op van de samenwerking
      'get-samenwerking-notificaties':
        'Alle notificaties van de samenwerking ophalen',
    },

    en: {
      title: 'Samenwerkfunctionaliteit',
      configurationTitle: 'Samenwerkfunctionaliteit plugin configuration',
      description:
        'A plugin for handling collaboration data within the Samenwerkfunctionaliteit API of the Digitaal Stelsel Omgevingswet (DSO).',
      configurationTitleTooltip:
        'In this section, you configure the Samenwerkfunctionaliteit plugin to easily send and retrieve data.',
      samenwerkfunctionaliteitUrl: 'Samenwerkfunctionaliteit URL',
      certificate: 'Certificate',
      oinNummer: 'OIN-Number',

      // Get Documents:
      'get-documentenoverzicht': 'Retrieve document list',
      resultPvName: 'Result process variable name',
      samenwerkingId: 'Collaboration ID',
      aangemaaktDoor: 'Created by',
      negateAangemaaktDoor: 'Exclude created by',
      aangemaaktDoorNaam: 'Created by name',
      negateAangemaaktDoorNaam: 'Exclude created by name',
      sort: 'Sort',
      aantal: 'Number of results',
      pagina: 'Page',

      variableFieldTooltip:
        "This field accepts either a literal value or a path to a (process) variable containing the value (e.g. 'pv:/result')",

      // Pluginacties
      // Actieverzoeken
      // Get a specific actieverzoek
      'get-actieverzoek': 'Request a single actieverzoek.',
      actieverzoekId: 'The actieverzoekId of this actieverzoek.',

      // Get all actieverzoeken
      'get-all-actieverzoeken':
        'Request all actieverzoeken for a given samenwerkingId.',
      isOrganisationTheReceiverTooltip:
        'Filters on actieverzoek of which the current organisation is the receiver.',
      isOrganisationTheReceiver:
        'If the actieverzoek should be filtered on organisation.',

      // Get alle notifications of the samenwerking
      'get-samenwerking-notificaties':
        'Request all notifications of the samenwerking',
    },
  },
};

export { samenwerkfunctionaliteitPluginSpecification };
