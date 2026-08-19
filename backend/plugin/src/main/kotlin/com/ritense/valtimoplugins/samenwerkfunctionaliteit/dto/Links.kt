package com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Links(
    @JsonProperty("_additionalProperties")
    val additionalProperties: Map<String, Link> = mutableMapOf(),
)
