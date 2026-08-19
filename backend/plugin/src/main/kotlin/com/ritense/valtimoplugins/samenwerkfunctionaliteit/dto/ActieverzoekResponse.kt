package com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.OffsetDateTime
import java.util.UUID

data class ActieverzoekResponse(
    @JsonProperty("_links")
    val links: Links? = null,
    val aantalBerichten: Int? = null,
    val actieverzoekId: UUID? = null,
    val creatieDatumTijd: OffsetDateTime? = null,
    val documenten: List<Document>? = null,
    val laatstAangepastDatumTijd: OffsetDateTime? = null,
    val laatstAangepastDoor: String? = null,
    val laatstAangepastDoorNaam: String? = null,
    val melding: String? = null,
    val omschrijving: String? = null,
    val ontvanger: String? = null,
    val ontvangerNaam: String? = null,
    val productId: String? = null,
    val samenwerkingId: String? = null,
    val status: Actieverzoek.ActieverzoekStatus? = null,
    val titel: String? = null,
    val zender: String? = null,
    val zenderNaam: String? = null,
)
