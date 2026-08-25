/*
 * Copyright 2026 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ritense.valtimoplugins.samenwerkfunctionaliteit.autoconfiguration

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.database.QueryDialectHelper
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.client.DefaultSamenwerkfunctionaliteitClient
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.client.SamenwerkfunctionaliteitClient
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.gateway.GatewayProperties
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.gateway.specification.GatewaySpecificationFactory
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.plugin.SamenwerkfunctionaliteitPluginFactory
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.DefaultOperatonService
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.DefaultSamenwerkfunctionaliteitService
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.OperatonService
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.SamenwerkfunctionaliteitService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient

@AutoConfiguration
class SamenwerkfunctionaliteitConfiguration {
    @Bean
    fun samenwerkfunctionaliteitClient(restClientBuilder: RestClient.Builder): SamenwerkfunctionaliteitClient =
        DefaultSamenwerkfunctionaliteitClient(
            restClientBuilder = restClientBuilder,
        )

    @Bean
    fun samenwerkfunctionaliteitService(
        samenwerkfunctionaliteitClient: SamenwerkfunctionaliteitClient,
    ): SamenwerkfunctionaliteitService =
        DefaultSamenwerkfunctionaliteitService(
            samenwerkfunctionaliteitClient = samenwerkfunctionaliteitClient,
        )

    @Bean
    fun operatonService(objectMapper: ObjectMapper): OperatonService =
        DefaultOperatonService(
            objectMapper = objectMapper,
        )

    @Bean
    fun samenwerkfunctionaliteitPluginFactory(
        pluginService: PluginService,
        samenwerkfunctionaliteitService: SamenwerkfunctionaliteitService,
        operatonService: OperatonService,
    ): SamenwerkfunctionaliteitPluginFactory =
        SamenwerkfunctionaliteitPluginFactory(
            pluginService = pluginService,
            samenwerkfunctionaliteitService = samenwerkfunctionaliteitService,
            operatonService = operatonService,
        )

    @Bean
    fun gatewayProperties(): GatewayProperties = GatewayProperties()

    @Bean
    fun gatewaySpecificationFactory(queryDialectHelper: QueryDialectHelper): GatewaySpecificationFactory =
        GatewaySpecificationFactory(
            queryDialectHelper = queryDialectHelper,
        )
}
