package com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto

data class UpdateActieverzoekRequest(
    val melding: String?,
    val omschrijving: String?,
    val productId: String?,
    val status: Actieverzoek.ActieverzoekStatus?,
    val titel: String?,
)
