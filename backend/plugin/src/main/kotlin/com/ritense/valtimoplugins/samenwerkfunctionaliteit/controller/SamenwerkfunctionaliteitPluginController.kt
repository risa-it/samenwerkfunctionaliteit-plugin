package com.ritense.valtimoplugins.samenwerkfunctionaliteit.controller

import com.fasterxml.jackson.databind.node.ObjectNode
import com.ritense.plugin.service.PluginConfigurationSearchParameters
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.config.FrontendConfig
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.UpdateActieverzoekRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Actieverzoek
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.FrontendAccessibleProperties
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Notificatie
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Page
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Samenwerking
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.SamenwerkfunctionaliteitService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@RestController
@RequestMapping("samenwerkfunctionaliteit")
class SamenwerkfunctionaliteitPluginController(
    private val pluginService: PluginService,
    private val frontendConfig: FrontendConfig,
    private val samenwerkfunctionaliteitService: SamenwerkfunctionaliteitService,
) {
    @GetMapping("api/v1/properties")
    fun getProperties(): FrontendAccessibleProperties =
        FrontendAccessibleProperties(
            oinNummer =
                extractPropertyFromSamenwerkfunctionaliteitPluginConfiguration(
                    SAMENWERKFUNCTIONALITEIT_PLUGIN_OIN_PROPERTY_NAME,
                ),
            baseUrl =
                extractPropertyFromSamenwerkfunctionaliteitPluginConfiguration(
                    SAMENWERKFUNCTIONALITEIT_PLUGIN_BASEURL_PROPERTY_NAME,
                ),
            backupUploadsToDocumentenApi =
                frontendConfig.uploadBackupToDocumentenApi,
        )

    private fun getSamenwerkfunctionaliteitPluginConfiguration(): ObjectNode? =
        pluginService
            .getPluginConfigurations(
                PluginConfigurationSearchParameters(
                    pluginDefinitionKey = SAMENWERKFUNCTIONALITEIT_PLUGIN_KEY,
                ),
            ).firstOrNull()
            ?.properties

    @GetMapping("v5/samenwerkingen/{samenwerkingId}")
    fun getSamenwerking(
        @PathVariable samenwerkingId: String,
    ): ResponseEntity<Samenwerking> {
        val properties = getProperties().toSamenwerkingProperties()

        return ResponseEntity.ok(samenwerkfunctionaliteitService.getSamenwerking(samenwerkingId, properties))
    }

    @GetMapping("v5/actieverzoeken/{actieverzoekId}")
    fun getActieverzoek(
        @PathVariable actieverzoekId: UUID,
    ): ResponseEntity<Actieverzoek> {
        val properties = getProperties().toSamenwerkingProperties()

        return ResponseEntity.ok(
            samenwerkfunctionaliteitService.getActieverzoek(
                properties = properties,
                actieverzoekId = actieverzoekId,
            ),
        )
    }

    @PatchMapping("v5/actieverzoeken/{actieverzoekId}")
    fun updateActieverzoek(
        @PathVariable actieverzoekId: UUID,
        @RequestBody updateActieverzoekRequest: UpdateActieverzoekRequest,
    ): ResponseEntity<Actieverzoek> {
        val properties = getProperties().toSamenwerkingProperties()
        logger.info {
            "Updating $actieverzoekId and $updateActieverzoekRequest"
        }

        return ResponseEntity.ok(
            samenwerkfunctionaliteitService.updateActieverzoek(
                properties = properties,
                actieverzoekId = actieverzoekId,
                request = updateActieverzoekRequest,
            ),
        )
    }

    @GetMapping("v5/documenten")
    fun getAllNotificaties(): ResponseEntity<Page<List<Notificatie>>> {
        val properties = getProperties().toSamenwerkingProperties()
        return ResponseEntity.ok(samenwerkfunctionaliteitService.getAllNotificaties(properties))
    }

    @GetMapping("v5/samenwerkingen/{samenwerkingId}/documenten")
    fun getDocumentenBySamenwerkingId(
        @PathVariable samenwerkingId: String,
    ): ResponseEntity<DocumentenOverzichtResponse> {
        val properties = getProperties().toSamenwerkingProperties()
        return ResponseEntity.ok(samenwerkfunctionaliteitService.getDocumentenOverzicht(properties, samenwerkingId))
    }

    @GetMapping("v5/documenten/{documentId}/content")
    fun getDocumentContentByDocumentId(
        @PathVariable documentId: UUID,
    ): ResponseEntity<ByteArray> {
        val properties = getProperties().toSamenwerkingProperties()
        return samenwerkfunctionaliteitService.downloadDocument(properties, documentId)
    }

    @PostMapping("v5/samenwerkingen/{samenwerkingId}/documenten")
    fun uploadDocument(
        @PathVariable samenwerkingId: String,
        @RequestParam file: MultipartFile,
        @RequestParam(required = false) metadata: Map<String, String>?,
    ): ResponseEntity<Void> {
        val properties = getProperties().toSamenwerkingProperties()
        samenwerkfunctionaliteitService.uploadDocument(properties, file, metadata, samenwerkingId)
        return ResponseEntity.ok().build()
    }

    private fun extractPropertyFromSamenwerkfunctionaliteitPluginConfiguration(name: String): String? =
        getSamenwerkfunctionaliteitPluginConfiguration()
            ?.get(name)
            ?.let { node ->
                if (node.isTextual) node.asText() else null
            }

    companion object {
        private val logger = KotlinLogging.logger { }
        const val SAMENWERKFUNCTIONALITEIT_PLUGIN_KEY = "samenwerkfunctionaliteit"
        const val SAMENWERKFUNCTIONALITEIT_PLUGIN_OIN_PROPERTY_NAME = "oinNummer"
        const val SAMENWERKFUNCTIONALITEIT_PLUGIN_BASEURL_PROPERTY_NAME = "baseUrl"
    }
}
