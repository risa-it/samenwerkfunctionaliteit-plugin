package com.ritense.valtimoplugins.samenwerkfunctionaliteit.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "valtimo.samenwerkfunctionaliteit.frontend.documents")
data class FrontendConfig(
    val uploadBackupToDocumentenApi: Boolean = false,
)
