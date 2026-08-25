package com.ritense.valtimoplugins.samenwerkfunctionaliteit.config

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(FrontendConfig::class)
class FrontendConfiguration
