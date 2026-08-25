package com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto

import com.fasterxml.jackson.annotation.JsonInclude

data class Link(
    val deprecation: String? = null,
    val href: String? = null,
    val hreflang: String? = null,
    val name: String? = null,
    val profile: String? = null,
    val templated: Boolean? = null,
    val title: String? = null,
    @field:JsonInclude(JsonInclude.Include.NON_NULL)
    val type: String? = null,
)
