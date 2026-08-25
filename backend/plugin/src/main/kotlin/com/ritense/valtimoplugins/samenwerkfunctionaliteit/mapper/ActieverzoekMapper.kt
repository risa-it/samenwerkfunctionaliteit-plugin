package com.ritense.valtimoplugins.samenwerkfunctionaliteit.mapper

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekenGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Actieverzoek
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Actieverzoek as ActieverzoekDTO

fun ActieverzoekDTO.toModel() =
    Actieverzoek(
        links = links?.toModel(),
        aantalBerichten = aantalBerichten,
        actieverzoekId = actieverzoekId,
        creatieDatumTijd = creatieDatumTijd,
        documenten = documenten,
        laatstAangepastDatumTijd = laatstAangepastDatumTijd,
        laatstAangepastDoor = laatstAangepastDoor,
        laatstAangepastDoorNaam = laatstAangepastDoorNaam,
        melding = melding,
        omschrijving = omschrijving,
        ontvanger = ontvanger,
        ontvangerNaam = ontvangerNaam,
        productId = productId,
        samenwerkingId = samenwerkingId,
        status = status?.toModel(),
        titel = titel,
        zender = zender,
        zenderNaam = zenderNaam,
    )

fun ActieverzoekResponse.toModel(): Actieverzoek =
    Actieverzoek(
        links = links?.toModel(),
        aantalBerichten = aantalBerichten,
        actieverzoekId = actieverzoekId,
        creatieDatumTijd = creatieDatumTijd,
        documenten = documenten,
        laatstAangepastDatumTijd = laatstAangepastDatumTijd,
        laatstAangepastDoor = laatstAangepastDoor,
        laatstAangepastDoorNaam = laatstAangepastDoorNaam,
        melding = melding,
        omschrijving = omschrijving,
        ontvanger = ontvanger,
        ontvangerNaam = ontvangerNaam,
        productId = productId,
        samenwerkingId = samenwerkingId,
        status = status?.toModel(),
        titel = titel,
        zender = zender,
        zenderNaam = zenderNaam,
    )

fun ActieverzoekenGetResponse.toModel(): List<Actieverzoek> =
    embedded?.actieverzoeken?.map { it.toModel() } ?: emptyList()
