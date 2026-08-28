package com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto

import jakarta.validation.Valid
import jakarta.validation.constraints.NotNull

data class CreateBerichtRequest(
    @field:NotNull
    @field:Valid
    val bericht: String,
)
