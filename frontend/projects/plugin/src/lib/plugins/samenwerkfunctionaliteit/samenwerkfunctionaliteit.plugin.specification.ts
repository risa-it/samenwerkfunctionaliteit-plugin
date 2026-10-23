import { PluginSpecification } from '@valtimo/plugin';
import { SAMENWERKFUNCTIONALITEIT_PLUGIN_LOGO_BASE64 } from './assets/samenwerkfunctionaliteit-plugin-logo';
import { DeleteBerichtComponent } from './components/delete-bericht/delete-bericht.component';
import { GetActieverzoekComponent } from './components/plugin-action-configuration/get-actieverzoek/get-actieverzoek.component';
import { GetAllActieverzoekenComponent } from './components/plugin-action-configuration/get-all-actieverzoeken/get-all-actieverzoeken.component';
import { GetDocumentenOverzichtComponent } from './components/plugin-action-configuration/get-documenten-overzicht/get-documenten-overzicht.component';
import { GetSamenwerkingNotificatiesComponent } from './components/plugin-action-configuration/get-samenwerking-notificaties/get-samenwerking-notificaties.component';
import { GetSamenwerkingComponent } from './components/plugin-action-configuration/get-samenwerking/get-samenwerking.component';
import { SamenwerkfunctionaliteitPluginConfigurationComponent } from './components/samenwerkfunctionaliteit-plugin-configuration/samenwerkfunctionaliteit-plugin-configuration.component';

const samenwerkfunctionaliteitPluginSpecification: PluginSpecification = {
  pluginId: 'samenwerkfunctionaliteit',
  pluginConfigurationComponent:
    SamenwerkfunctionaliteitPluginConfigurationComponent,
  pluginLogoBase64: SAMENWERKFUNCTIONALITEIT_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'get-actieverzoek': GetActieverzoekComponent,
    'get-all-actieverzoeken': GetAllActieverzoekenComponent,
    'delete-bericht': DeleteBerichtComponent,
    'get-documentenoverzicht': GetDocumentenOverzichtComponent,
    'get-samenwerking-notificaties': GetSamenwerkingNotificatiesComponent,
    'get-samenwerking': GetSamenwerkingComponent,
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

      // Berichten
      // Haal een specifiek bericht op
      'get-bericht': '(Nog niet geïmplementeerd) Bericht ophalen',

      // Verstuur een bericht
      'post-bericht': '(Nog niet geïmplementeerd) Bericht versturen',

      // Verwijder een bericht
      'delete-bericht': '(Nog niet geïmplementeerd) Bericht verwijderen',

      // Documenten
      // Haal een overzicht van documenten op:
      'get-documentenoverzicht': 'Documentenoverzicht ophalen',
      resultPvName: 'Naam van resultaat-procesvariabele',
      samenwerkingId: 'Samenwerking-ID',
      aangemaaktDoor: 'Aangemaakt door',
      negateAangemaaktDoor: 'Aangemaakt door uitsluiten',
      aangemaaktDoorNaam: 'Aangemaakt door naam',
      negateAangemaaktDoorNaam: 'Aangemaakt door naam uitsluiten',
      sort: 'Sortering',
      aantal: 'Aantal resultaten',
      pagina: 'Pagina',

      // Upload een document
      'download-document': '(Nog niet geïmplementeerd) Document downloaden',

      // Download een document
      'upload-document': '(Nog niet geïmplementeerd) Document uploaden',

      // Samenwerkingen
      // Haal alle notificaties op van de samenwerking
      'get-samenwerking-notificaties':
        'Alle notificaties van de samenwerking ophalen',

      // Haal een specifieke samenwerking op
      'get-samenwerking':
        'Een specifieke samenwerking ophalen',
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

      variableFieldTooltip:
        "This field accepts either a literal value or a path to a (process) variable containing the value (e.g. 'pv:/result')",

      // Plugin actions
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

      // Messages
      // Fetch a specific message
      'get-bericht': '(Not yet implemented) Fetch a specific message',

      // Send a message
      'post-bericht': '(Not yet implemented) Send a message',

      // Delete a message
      'delete-bericht': '(Not yet implemented) Delete a message',

      // Documents
      // Get Documents
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

      // Upload a document
      'download-document': '(Not yet implemented) Download a document',

      // Download a document
      'upload-document': '(Not yet implemented) Upload a document',

      // Samenwerkingen
      // Get all notifications of the samenwerking
      'get-samenwerking-notificaties':
        'Request all notifications of the samenwerking',

      // Fetch a specific samenwerking
      'get-samenwerking':
        'Request a specific samenwerking',
    },
  },
};

export { samenwerkfunctionaliteitPluginSpecification };
