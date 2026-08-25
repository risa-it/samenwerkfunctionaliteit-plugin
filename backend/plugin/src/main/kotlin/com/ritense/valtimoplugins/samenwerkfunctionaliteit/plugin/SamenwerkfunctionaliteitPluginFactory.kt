package com.ritense.valtimoplugins.samenwerkfunctionaliteit.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.OperatonService
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.SamenwerkfunctionaliteitService

class SamenwerkfunctionaliteitPluginFactory(
    pluginService: PluginService,
    private val samenwerkfunctionaliteitService: SamenwerkfunctionaliteitService,
    private val operatonService: OperatonService,
) : PluginFactory<SamenwerkfunctionaliteitPlugin>(pluginService) {
    override fun create() =
        SamenwerkfunctionaliteitPlugin(
            samenwerkfunctionaliteitService,
            operatonService,
        )
}
