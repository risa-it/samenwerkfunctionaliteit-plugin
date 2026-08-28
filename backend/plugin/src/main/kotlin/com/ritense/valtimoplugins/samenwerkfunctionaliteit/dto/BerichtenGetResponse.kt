package com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class BerichtenGetResponse(
    @field:JsonProperty("_embedded")
    val embedded: Berichten? = null,
    @field:JsonProperty("_links")
    val links: Links? = null,
) {
    data class Berichten(
        val berichten: List<BerichtResponse>,
    )
}

data class PagedBerichtenGetResponse(
    @field:JsonProperty("_embedded")
    val embedded: BerichtenGetResponse.Berichten? = null,
    @field:JsonProperty("_links")
    val links: Links? = null,
    val page: Page? = null,
)
