package com.ritense.valtimoplugins.samenwerkfunctionaliteit.model

import java.net.URI

data class FrontendAccessibleProperties(
    val oinNummer: String?,
    val baseUrl: String?,
    val backupUploadsToDocumentenApi: Boolean,
) {
    fun toSamenwerkingProperties(): SamenwerkfunctionaliteitProperties =
        SamenwerkfunctionaliteitProperties(
            baseUrl = URI(this.baseUrl ?: throw IllegalArgumentException("baseUrl is required")),
            certificate = "",
            oinNummer = this.oinNummer ?: throw IllegalArgumentException("oinNummer is required"),
        )
}
