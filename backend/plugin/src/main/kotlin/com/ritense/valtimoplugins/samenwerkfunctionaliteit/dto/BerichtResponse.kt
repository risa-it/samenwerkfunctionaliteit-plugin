package com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto

data class BerichtResponse(
    val _links: Links?,
    val actieverzoekId: String,
    val berichtId: String,
    val creatieDatumTijd: String,
    val inhoud: String,
    val ontvanger: String,
    val ontvangerNaam: String?,
    val samenwerkingId: String?,
    val zender: String?,
    val zenderNaam: String?,
)
