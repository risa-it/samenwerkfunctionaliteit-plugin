package com.ritense.valtimoplugins.samenwerkfunctionaliteit.controller

import com.fasterxml.jackson.databind.node.ObjectNode
import com.ritense.plugin.service.PluginConfigurationSearchParameters
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.config.FrontendConfig
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.BerichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.CreateBerichtRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.PagedBerichtenGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.PagedNotificatieGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.SamenwerkingResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.UpdateActieverzoekRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.FrontendAccessibleProperties
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.SamenwerkfunctionaliteitProxyService
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.SamenwerkfunctionaliteitService
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.validation.Valid
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
@RequestMapping("api/v1/samenwerkfunctionaliteit")
class SamenwerkfunctionaliteitPluginController(
    private val pluginService: PluginService,
    private val frontendConfig: FrontendConfig,
    private val samenwerkfunctionaliteitProxyService: SamenwerkfunctionaliteitProxyService,
) {
    @GetMapping("properties")
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

    @GetMapping("v5/samenwerkingen/{samenwerkingId}")
    fun getSamenwerkingProxy(
        @PathVariable samenwerkingId: String,
    ): ResponseEntity<SamenwerkingResponse> {
        val properties = getProperties().toSamenwerkingProperties()

        return ResponseEntity.ok(samenwerkfunctionaliteitProxyService.getSamenwerking(samenwerkingId, properties))
    }

    @GetMapping("v5/actieverzoeken/{actieverzoekId}")
    fun getActieverzoekProxy(
        @PathVariable actieverzoekId: UUID,
    ): ResponseEntity<ActieverzoekResponse> {
        val properties = getProperties().toSamenwerkingProperties()

        return ResponseEntity.ok(
            samenwerkfunctionaliteitProxyService.getActieverzoek(
                properties = properties,
                actieverzoekId = actieverzoekId,
            ),
        )
    }

    @PatchMapping("v5/actieverzoeken/{actieverzoekId}")
    fun updateActieverzoekProxy(
        @PathVariable actieverzoekId: UUID,
        @RequestBody @Valid updateActieverzoekRequest: UpdateActieverzoekRequest,
    ): ResponseEntity<ActieverzoekResponse> {
        val properties = getProperties().toSamenwerkingProperties()
        logger.info {
            "Updating $actieverzoekId with $updateActieverzoekRequest"
        }

        return ResponseEntity.ok(
            samenwerkfunctionaliteitProxyService.updateActieverzoek(
                properties = properties,
                actieverzoekId = actieverzoekId,
                request = updateActieverzoekRequest,
            ),
        )
    }

    @GetMapping("v5/notificaties")
    fun getAllNotificatiesProxy(
        @RequestParam page: Int?,
        @RequestParam amount: Int?,
    ): ResponseEntity<PagedNotificatieGetResponse> {
        val properties = getProperties().toSamenwerkingProperties()
        return ResponseEntity.ok(samenwerkfunctionaliteitProxyService.getAllNotificaties(properties, page, amount))
    }

    @GetMapping("v5/samenwerkingen/{samenwerkingId}/documenten")
    fun getDocumentenBySamenwerkingIdProxy(
        @PathVariable samenwerkingId: String,
    ): ResponseEntity<DocumentenOverzichtResponse> {
        val properties = getProperties().toSamenwerkingProperties()
        return ResponseEntity.ok(
            samenwerkfunctionaliteitProxyService.getDocumentenOverzicht(
                properties,
                samenwerkingId,
            ),
        )
    }

    @GetMapping("v5/documenten/{documentId}/content")
    fun getDocumentContentByDocumentIdProxy(
        @PathVariable documentId: UUID,
    ): ResponseEntity<ByteArray> {
        val properties = getProperties().toSamenwerkingProperties()
        return samenwerkfunctionaliteitProxyService.downloadDocument(properties, documentId)
    }

    @PostMapping("v5/samenwerkingen/{samenwerkingId}/documenten")
    fun uploadDocumentProxy(
        @PathVariable samenwerkingId: String,
        @RequestParam file: MultipartFile,
        @RequestParam(required = false) metadata: Map<String, String>?,
    ): ResponseEntity<Void> {
        val properties = getProperties().toSamenwerkingProperties()
        samenwerkfunctionaliteitProxyService.uploadDocument(properties, file, metadata, samenwerkingId)
        return ResponseEntity.ok().build()
    }

    @GetMapping("v5/actieverzoeken/{actieverzoekId}/berichten")
    fun getBerichtenProxy(
        @PathVariable actieverzoekId: UUID,
    ): ResponseEntity<PagedBerichtenGetResponse> {
        val properties = getProperties().toSamenwerkingProperties()
        return ResponseEntity.ok(
            samenwerkfunctionaliteitProxyService.getBerichten(
                properties = properties,
                actieverzoekId = actieverzoekId,
            ),
        )
    }

    @PostMapping("v5/actieverzoeken/{actieverzoekId}/berichten")
    fun postBerichtProxy(
        @PathVariable actieverzoekId: UUID,
        @RequestBody @Valid postBerichtRequest: CreateBerichtRequest,
    ): ResponseEntity<BerichtResponse> {
        val properties = getProperties().toSamenwerkingProperties()
        return ResponseEntity.ok(
            samenwerkfunctionaliteitProxyService.postBericht(properties, actieverzoekId, postBerichtRequest),
        )
    }

    private fun getSamenwerkfunctionaliteitPluginConfiguration(): ObjectNode? =
        pluginService
            .getPluginConfigurations(
                PluginConfigurationSearchParameters(
                    pluginDefinitionKey = SAMENWERKFUNCTIONALITEIT_PLUGIN_KEY,
                ),
            ).firstOrNull()
            ?.properties

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
