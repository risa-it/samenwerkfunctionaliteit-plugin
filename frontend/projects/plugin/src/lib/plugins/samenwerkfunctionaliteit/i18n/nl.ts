export const pluginNlTranslations = {
  samenwerkfunctionaliteit: {
    common: {
      actions: {
        cancel: 'Annuleren',
        continue: 'Bevestigen',
        delete: 'Verwijderen',
        download: 'Downloaden',
        search: 'Zoeken',
        upload: 'Uploaden',
      },
    },
    types: {
      confidentiality: {
        confidential: 'Vertrouwelijk',
        strictlyConfidential: 'Strict vertrouwelijk',
      },
      notification: {
        status: 'Status',
        document: 'Document',
        system: 'Systeem',
        message: 'Bericht',
      },
      document: {
        fileName: 'Bestandsnaam',
        confidentialityType: 'Vertrouwelijkheid',
        dateCreated: 'Datum aangemaakt',
        numberWithinSystem: 'Nummer binnen systeem',
        systemId: 'Kenmerk van het systeem',
        documentDescription: 'Documentomschrijving',
      },
    },
    documentTable: {
      selectedFile: '{{ filename }} geselecteerd',
      documentUploadModal: {
        title: 'Document uploaden',
        confidentialityTypeTooltip:
          'Alle documenten binnen een samenwerking dienen als vertrouwelijk te worden behandeld. Documenten die persoonsgegevens en/of bedrijfsgevoelige informatie bevatten hebben een hoger vertrouwelijkheidsniveau, nl. “strikt vertrouwelijk”. Deze documenten mogen alleen worden ingezien en/of aangepast door instanties die bevoegd zijn om dergelijke informatie te verwerken.',
      },
      documentDeleteModal: {
        title: 'Document verwijderen',
        message:
          "Weet je zeker dat je '{{filename}}' uit de samenwerking wilt verwijderen? Het document zal niet meer voor jou en andere deelnemers beschikbaar zijn.",
      },
    },
    messenger: {
      messengerTitle: 'Stuur bericht',
      messagePlaceholder: 'Typ hier uw bericht',
      sendMessage: 'Bericht versturen',
      loadingMessages: 'Berichten aan het laden...',
    },
    feedback: {
      notAnSwfCaseMessage: {
        genericTitle: 'Tabblad kan niet getoond worden.',
        genericMessage:
          'Dit dossier is niet gekoppeld aan een samenwerking in het Digitaal Stelsel Omgevingswet.',

        samenwerkingTitle: 'Geen samenwerking opgehaald',
      },
      userNotification: {
        contactYourAdmin:
          'Neem contact op met uw beheerder als dit probleem zich vaker voordoet.',
        failedGeneric: 'Er ging iets mis',
        genericSuccessTitle: 'Gelukt',
        genericSuccessMessage: 'De actie is succesvol uitgevoerd',

        downloadDocument: {
          failure: {
            title: 'Er ging iets mis tijdens het downloaden',
          },
        },

        deleteDocument: {
          success: {
            title: 'Document verwijderd',
            message:
              'Het document {{ filename }} is succesvol uit de samenwerking verwijderd.',
          },
          failure: {
            title: 'Er ging iets mis tijdens het verwijderen van het document',
          },
        },

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
          NoLinkedUploadProcessFailure: {
            message:
              'Geen gekoppeld uploadproces gevonden. Controleer de configuratie van dit dossiertype. ',
          },
        },

        messenger: {
          sendMessage: {
            success: {
              title: 'Verzonden',
              message: 'Het bericht is succesvol verstuurd.',
            },
            failure: {
              title: 'Het bericht kon niet verstuurd worden',
            },
          },
          fetchMessages: {
            failure: {
              title: 'Berichten konden niet opgehaald worden',
            },
          },
          failureMissingActieverzoekId: {
            message: 'Het actieverzoek kon niet gevonden worden.',
          },
        },
      },
    },
    messages: {
      timestamp: {
        justNow: 'Zojuist',
        today: 'Vandaag',
        minuteSingular: '{{ minuteCount }} minuut geleden',
        minutePlural: '{{ minuteCount }} minuten geleden',
      },
    },

    actieverzoekStatusTypes: {
      open: 'Open',
      inProgress: 'In behandeling',
      rejected: 'Afgewezen',
      withdrawn: 'Ingetrokken',
      reportedReady: 'Gereedgemeld',
      ready: 'Gereed',
    },
    actieverzoekStatusUpdate: {
      failedTitle: 'Actieverzoekstatus wijzigen mislukt.',
      failedMessage:
        'Er ging iets mis tijdens het wijzigen van de status van het actieverzoek. Probeer het later nog eens.',
      successTitle: 'Actieverzoekstatus succesvol gewijzigd.',
      successMessage:
        'De status van actieverzoek {{ name }} is succesvol gewijzigd naar {{ status }}.',
    },
    actieverzoekCard: {
      status: 'Status',
      date: 'Datum aangemaakt',
      sentBy: 'Verzonden door',
      productCode: 'Productcode',
      description: 'Omschrijving',
    },
    actieverzoekUpdateStatusModal: {
      updateStatusTo: 'Wijzig actieverzoekstatus naar',
      updateStatusExplanation: 'Toelichting',
      updateStatus: 'Status wijzigen',
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
