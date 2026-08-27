package com.ritense.valtimoplugins.samenwerkfunctionaliteit.model

import com.fasterxml.jackson.annotation.JsonProperty

data class DocumentenOverzicht(
    @field:JsonProperty("_embedded")
    val embedded: Documenten? = null,
    @field:JsonProperty("_links")
    val links: Links? = null,
) {
    data class Documenten(
        val documenten: List<Document>,
    )
}
