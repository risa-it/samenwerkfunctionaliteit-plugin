package com.ritense.valtimoplugins.samenwerkfunctionaliteit.model

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.OffsetDateTime
import java.util.UUID

data class Document(
    val documentId: UUID,
    val bestandsNaam: String,
    val kenmerkSysteem: String?,
    val nummerBinnenSysteem: String?,
    val samenwerkingId: String,
    val aangemaaktDoor: String,
    val aangemaaktDoorNaam: String,
    val creatieDatumTijd: OffsetDateTime,
    val laatstAangepastDoor: String?,
    val laatstAangepastDoorNaam: String?,
    val laatstAangepastDatumTijd: OffsetDateTime?,
    val documentOmschrijving: String?,
    val vertrouwelijkheidsAanduiding: String?,
    val taal: String?,
    val formaat: String?,
    val documentHash: String?,
    @JsonProperty("_links")
    val links: DocumentLinksResponse? = null,
)

data class DocumentLinksResponse(
    val self: LinkResponse? = null,
    val content: LinkResponse? = null,
    val ontkoppelenVanActieverzoek: LinkResponse? = null,
)

data class LinkResponse(
    val href: String,
)
