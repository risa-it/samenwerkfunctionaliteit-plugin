package com.ritense.valtimoplugins.samenwerkfunctionaliteit.resolver

import com.fasterxml.jackson.core.JsonPointer
import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.document.domain.impl.JsonSchemaDocumentId
import com.ritense.document.service.impl.JsonSchemaDocumentService
import com.ritense.plugin.service.PluginConfigurationSearchParameters
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.domain.impl.OperatonProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.config.PLUGIN_KEY
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.SamenwerkfunctionaliteitService
import com.ritense.valueresolver.ValueResolverFactory
import com.ritense.valueresolver.ValueResolverPropertyKey.Companion.DOCUMENT_ID
import com.ritense.valueresolver.ValueResolverPropertyKey.Companion.PROCESS_INSTANCE_ID
import com.ritense.valueresolver.ValueResolverPropertyKey.Companion.VARIABLE_SCOPE
import io.github.oshai.kotlinlogging.KotlinLogging
import javassist.NotFoundException
import org.operaton.bpm.engine.delegate.VariableScope
import java.util.UUID
import java.util.function.Function

class SamenwerkfunctionaliteitValueResolverFactory(
    private val samenwerkfunctionaliteitService: SamenwerkfunctionaliteitService,
    private val processDocumentService: ProcessDocumentService,
    private val pluginService: PluginService,
    private val documentService: JsonSchemaDocumentService,
    private val objectMapper: ObjectMapper,
) : ValueResolverFactory {
    override fun supportedPrefix(): String = SWF_VALUE_RESOLVER_PREFIX

    override fun createResolver(documentId: String): Function<String, Any?> =
        Function { requestedValue: String ->
            when (requestedValue) {
                "actieverzoek" -> {
                    getActieverzoekOrNull(documentId).also {
                        logger.info {
                            "Resolver was run for ${SWF_VALUE_RESOLVER_PREFIX}:actieverzoek from document $documentId"
                        }
                    }
                }

                "samenwerking" -> {
                    getSamenwerkingOrNull(documentId).also {
                        logger.info {
                            "Resolver was run for ${SWF_VALUE_RESOLVER_PREFIX}:samenwerking from document $documentId"
                        }
                    }
                }

                else -> {
                    throw IllegalArgumentException(
                        "Unknown requested value in Samenwerkingfunctionaliteit with name: $requestedValue",
                    )
                }
            }
        }

    override fun createResolver(
        processInstanceId: String,
        variableScope: VariableScope,
    ): Function<String, Any?> {
        val documentId =
            processDocumentService
                .getDocumentId(
                    OperatonProcessInstanceId(processInstanceId),
                    variableScope,
                ).toString()

        return createResolver(documentId)
    }

    //  This override is called by Formio value resolver references
    override fun createResolver(properties: Map<String, Any>): Function<String, Any?> {
        val documentId = properties[DOCUMENT_ID]?.toString()
        if (documentId != null) {
            return createResolver(documentId)
        }

        val processInstanceId = properties[PROCESS_INSTANCE_ID] as String?
        val variableScope = properties[VARIABLE_SCOPE] as VariableScope?
        if (processInstanceId != null && variableScope != null) {
            return createResolver(processInstanceId, variableScope)
        }

        throw NotImplementedError()
    }

    private fun getActieverzoekOrNull(documentId: String): Map<String, Any?>? {
        val actieverzoekIdString = getValueFromJsonDocument(documentId, ACTIEVERZOEK_ID_JSON_PATH)

        if (actieverzoekIdString.isBlank()) {
            return null
        }

        val actieverzoek =
            samenwerkfunctionaliteitService
                .getActieverzoek(
                    getProperties(),
                    UUID.fromString(actieverzoekIdString),
                ).also { logger.debug { "Retrieved actieverzoek: $it" } }

        return objectMapper.convertValue(
            actieverzoek,
            object : com.fasterxml.jackson.core.type.TypeReference<Map<String, Any?>>() {},
        )
    }

    private fun getSamenwerkingOrNull(documentId: String): Map<String, Any?>? {
        val samenwerkingId = getValueFromJsonDocument(documentId, SAMENWERKING_ID_JSON_PATH)

        if (samenwerkingId.isBlank()) {
            return null
        }

        val samenwerking =
            samenwerkfunctionaliteitService
                .getSamenwerking(
                    samenwerkingId,
                    getProperties(),
                ).also { logger.debug { "Retrieved samenwerking: $it" } }

        return objectMapper.convertValue(
            samenwerking,
            object : com.fasterxml.jackson.core.type.TypeReference<Map<String, Any?>>() {},
        )
    }

    private fun getValueFromJsonDocument(
        documentId: String,
        jsonPath: String,
    ): String {
        val document = documentService.getDocumentBy(JsonSchemaDocumentId.existingId(documentId))

        val jsonPointer = JsonPointer.valueOf(jsonPath)

        return document
            .content()
            .getValueBy(jsonPointer)
            .also {
                if (it.isEmpty) {
                    logger.warn { "No value found in document under '$jsonPath'" }
                }
            }.map { it.asText("") }
            .orElse("")
    }

    private fun getProperties(): SamenwerkfunctionaliteitProperties {
        val properties =
            pluginService
                .getPluginConfigurations(
                    PluginConfigurationSearchParameters(pluginDefinitionKey = PLUGIN_KEY),
                ).firstOrNull()
                ?.properties
                ?.let {
                    objectMapper.treeToValue(
                        it,
                        SamenwerkfunctionaliteitProperties::class.java,
                    )
                }
        if (properties == null) {
            throw NotFoundException("Could not find any plugin configuration for key '$PLUGIN_KEY'")
        }

        return properties
    }

    companion object {
        private val logger = KotlinLogging.logger { }
        private const val SWF_VALUE_RESOLVER_PREFIX = "swf"
        private const val SAMENWERKING_ID_JSON_PATH = "/samenwerkingProperties/samenwerkingId"
        private const val ACTIEVERZOEK_ID_JSON_PATH = "/samenwerkingProperties/actieverzoekDetails/actieverzoekId"
    }
}
