package com.ritense.valtimoplugins.samenwerkfunctionaliteit.mapper

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.SamenwerkingResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Samenwerking

fun SamenwerkingResponse.toModel() =
    Samenwerking(
        links = _links?.toModel(),
        aangemaaktDoor = aangemaaktDoor,
        aangemaaktDoorNaam = aangemaaktDoorNaam,
        aantalActieverzoeken = aantalActieverzoeken,
        aantalNotificaties = aantalNotificaties,
        beschrijving = beschrijving,
        bronVerzoek = bronVerzoek,
        contactpersoonEmailadres = contactpersoonEmailadres,
        contactpersoonNaam = contactpersoonNaam,
        contactpersoonTelefoonnummer = contactpersoonTelefoonnummer,
        creatieDatumTijd = creatieDatumTijd,
        eindDatumTijd = eindDatumTijd,
        globaleLocatie = globaleLocatie,
        kenmerkSysteem = kenmerkSysteem,
        laatstAangepastDatumTijd = laatstAangepastDatumTijd,
        laatstAangepastDoor = laatstAangepastDoor,
        laatstAangepastDoorNaam = laatstAangepastDoorNaam,
        nummerBinnenSysteem = nummerBinnenSysteem,
        oloVerzoeknummer = oloVerzoeknummer,
        samenwerkDoel = samenwerkDoel,
        samenwerkVorm = samenwerkVorm,
        samenwerkingId = samenwerkingId,
        status = status?.toModel(),
        taal = taal,
        titel = titel,
        typeVerzoek = typeVerzoek,
        verzoeknummer = verzoeknummer,
    )
