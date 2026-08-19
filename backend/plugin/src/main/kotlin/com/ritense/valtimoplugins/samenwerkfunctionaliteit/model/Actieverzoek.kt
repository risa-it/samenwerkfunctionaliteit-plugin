package com.ritense.valtimoplugins.samenwerkfunctionaliteit.model

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Document
import java.time.OffsetDateTime
import java.util.UUID

data class Actieverzoek(
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
    val status: ActieverzoekStatus? = null,
    val titel: String? = null,
    val zender: String? = null,
    val zenderNaam: String? = null,
) {
    enum class ActieverzoekStatus {
        OPEN,
        IN_BEHANDELING,
        GEWEIGERD,
        INGETROKKEN,
        GEREEDGEMELD,
        GEREED,
    }
}
