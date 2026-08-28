package com.ritense.valtimoplugins.samenwerkfunctionaliteit.mapper

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Document
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.DocumentLinksResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.DocumentenOverzicht
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.LinkResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Document as DocumentResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentLinksResponse as DocumentLinksDto
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Documenten as DocumentenDTO
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.LinkResponse as LinkDto

fun DocumentResponse.toModel(): Document =
    Document(
        documentId = documentId,
        bestandsNaam = bestandsNaam,
        kenmerkSysteem = kenmerkSysteem,
        nummerBinnenSysteem = nummerBinnenSysteem,
        samenwerkingId = samenwerkingId,
        aangemaaktDoor = aangemaaktDoor,
        aangemaaktDoorNaam = aangemaaktDoorNaam,
        creatieDatumTijd = creatieDatumTijd,
        laatstAangepastDoor = laatstAangepastDoor,
        laatstAangepastDoorNaam = laatstAangepastDoorNaam,
        laatstAangepastDatumTijd = laatstAangepastDatumTijd,
        documentOmschrijving = documentOmschrijving,
        vertrouwelijkheidsAanduiding = vertrouwelijkheidsAanduiding,
        taal = taal,
        formaat = formaat,
        documentHash = documentHash,
        links = links?.toModel(),
    )

fun DocumentenOverzichtResponse.toModel(): DocumentenOverzicht =
    DocumentenOverzicht(
        embedded = embedded?.toModel(),
        links = links?.toModel(),
    )

fun DocumentenDTO.toModel(): DocumentenOverzicht.Documenten =
    DocumentenOverzicht.Documenten(
        documenten = documenten.map { it.toModel() },
    )

fun DocumentLinksDto.toModel(): DocumentLinksResponse =
    DocumentLinksResponse(
        self = self?.toModel(),
        content = content?.toModel(),
        ontkoppelenVanActieverzoek = ontkoppelenVanActieverzoek?.toModel(),
    )

fun LinkDto.toModel(): LinkResponse =
    LinkResponse(
        href = href,
    )
