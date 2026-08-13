export const pluginNlTranslations = {
  samenwerkfunctionaliteit: {
    notifications: {
      types: {
        status: 'Status',
        document: 'Document',
        system: 'Systeem',
        message: 'Bericht',
      },
    },
    documentTable: {
      delete: 'Verwijderen',
      fileName: 'Bestandsnaam',
      confidentialityType: 'Vertrouwelijkheidsaanduiding',
      dateCreated: 'Datum aangemaakt',
      selectedFile: '{{ filename }} geselecteerd',
    },
    feedback: {
      userNotification: {
        contactYourAdmin:
          'Neem contact op met uw beheerder als dit probleem zich vaker voordoet.',
        failedGeneric: 'Er ging iets mis',
        genericSuccessTitle: 'Gelukt',
        genericSuccessMessage: 'De actie is succesvol uitgevoerd',

        downloadDocumentFailureTitle: 'Er ging iets mis tijdens het downloaden',

        fetchDocuments: {
          failure: {
            title:
              'Er ging iets mis tijdens het ophalen van de lijst van documenten',
          },
        },

        uploadDocumentToSWF: {
          success: {
            title: 'Uploaden naar de Samenwerkfunctionaliteit gelukt',
            message:
              '{{ filename }} is succesvol aan de samenwerking toegevoegd.',
          },
          failure: {
            title: 'Uploaden naar de samenwerking mislukt',
          },
        },

        uploadDocumentToDocumentenApi: {
          success: {
            title: 'Uploaden naar de Documenten-API gelukt',
            message:
              'Archiveringskopie {{ filename }} is succesvol geüpload naar de Documenten-API.',
          },
          failure: {
            title: 'Uploaden van archiveringskopie naar Documenten-API mislukt',
          },
        },
      },
    },
    messages: {
      datetimestamp: {
        justNow: 'Zojuist',
        today: 'Vandaag',
        minuteSingular: '{{ minuteCount }} minuut geleden',
        minutePlural: '{{ minuteCount }} minuten geleden',
      },
    },
  },
  carbon: {
    pagination: {
      itemsPerPage: 'Aantal {{ itemNamePlural}} per pagina:',
      openListOfOptions: 'Lijst met opties openen',
      previousPage: 'Vorige pagina',
      nextPage: 'Volgende pagina',
      totalItemsUnknown: '{{start}}-{{end}} {{ itemNamePlural }}',
      totalItems: '{{start}}-{{end}} van {{total}} {{ itemNamePlural }}',
      totalItem: '{{start}}-{{end}} van {{total}} {{ itemNameSingular }}',
      ofLastPages: "van {{last}} pagina's",
      ofLastPage: 'van {{last}} pagina',
    },
  },
};
