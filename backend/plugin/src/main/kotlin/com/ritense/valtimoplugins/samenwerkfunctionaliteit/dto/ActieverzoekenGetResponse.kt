package com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class ActieverzoekenGetResponse(
    @field:JsonProperty("_embedded")
    val embedded: Actieverzoeken? = null,
    @field:JsonProperty("_links")
    val links: Links? = null,
) {
    data class Actieverzoeken(
        val actieverzoeken: List<Actieverzoek>,
    )
}
