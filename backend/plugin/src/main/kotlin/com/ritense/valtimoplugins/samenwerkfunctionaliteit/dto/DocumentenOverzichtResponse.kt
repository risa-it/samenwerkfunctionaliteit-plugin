package com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class DocumentenOverzichtResponse(
    @JsonProperty("_embedded")
    val embedded: Documenten? = null,
    @JsonProperty("_links")
    val links: Links? = null,
    val page: Page,
)

data class Documenten(
    val documenten: List<Document>,
)
