package com.ritense.valtimoplugins.samenwerkfunctionaliteit.resolver

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.ritense.document.domain.impl.JsonDocumentContent
import com.ritense.document.domain.impl.JsonSchemaDocument
import com.ritense.document.domain.impl.JsonSchemaDocumentId
import com.ritense.document.service.impl.JsonSchemaDocumentService
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.domain.PluginDefinition
import com.ritense.plugin.service.PluginConfigurationSearchParameters
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.domain.impl.OperatonProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Actieverzoek
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Link
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.SamenwerkingResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Status
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.SamenwerkfunctionaliteitService
import com.ritense.valueresolver.ValueResolverPropertyKey.Companion.DOCUMENT_ID
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import javassist.NotFoundException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.operaton.bpm.engine.delegate.VariableScope
import java.net.URI
import java.time.OffsetDateTime
import java.util.UUID

class SamenwerkfunctionaliteitValueResolverFactoryTest {
    private lateinit var factory: SamenwerkfunctionaliteitValueResolverFactory
    private lateinit var samenwerkfunctionaliteitService: SamenwerkfunctionaliteitService
    private lateinit var processDocumentService: ProcessDocumentService
    private lateinit var pluginService: PluginService
    private lateinit var documentService: JsonSchemaDocumentService
    private lateinit var objectMapper: ObjectMapper

    @BeforeEach
    fun setup() {
        samenwerkfunctionaliteitService = mockk()
        processDocumentService = mockk()
        pluginService = mockk()
        documentService = mockk()
        objectMapper = ObjectMapper().registerKotlinModule().registerModule(JavaTimeModule())

        factory =
            SamenwerkfunctionaliteitValueResolverFactory(
                samenwerkfunctionaliteitService,
                processDocumentService,
                pluginService,
                documentService,
                objectMapper,
            )
    }

    @Test
    fun `supportedPrefix should return swf`() {
        assertEquals("swf", factory.supportedPrefix())
    }

    @Test
    fun `createResolver(documentId) should return a function that resolves 'samenwerking'`() {
        // Arrange
        val mockumentId = UUID.randomUUID().toString()
        val mockSamenwerkingResponse = MOCK_SAMENWERKING_RESPONSE
        val mappedMockSamenwerkingResponse =
            objectMapper
                .convertValue(
                    mockSamenwerkingResponse,
                    object : com.fasterxml.jackson.core.type.TypeReference<Map<String, Any?>>() {},
                )
        val mockJsonSchemaDocument = mockk<JsonSchemaDocument>()
        val mockDocumentContent =
            JsonDocumentContent(
                """
                {
                    "samenwerkingProperties": {
                        "samenwerkingId": "SAM-12345"
                    }
                }
                """.trimIndent(),
            )

        val mockPluginConfiguration =
            PluginConfiguration(
                id = PluginConfigurationId.newId(),
                title = "My super cool mock plugin",
                properties =
                    objectMapper.createObjectNode().apply {
                        put("baseUrl", "http://example.com")
                        put("certificate", "Don't tell anyone. Promise?")
                        put("oinNummer", "123456789")
                    },
                pluginDefinition = mockk<PluginDefinition>(),
            )

        every { samenwerkfunctionaliteitService.getSamenwerking(any(), any()) } returns mockSamenwerkingResponse
        every { documentService.getDocumentBy(JsonSchemaDocumentId.existingId(mockumentId)) } returns
            mockJsonSchemaDocument
        every { mockJsonSchemaDocument.content() } returns mockDocumentContent
        every {
            pluginService
                .getPluginConfigurations(any<PluginConfigurationSearchParameters>())
        } returns
            listOf(mockPluginConfiguration)

        //  Act
        val resolver = factory.createResolver(mockumentId)
        val result = resolver.apply("samenwerking")

        // Assert
        assertEquals(mappedMockSamenwerkingResponse, result)
    }

    @Test
    fun `createResolver(documentId) should return a function that resolves 'actieverzoek'`() {
        // Arrange
        val mockumentId = UUID.randomUUID().toString()
        val mockActieverzoekResponse = MOCK_ACTIEVERZOEK_RESPONSE
        val mappedMockActieverzoekResponse =
            objectMapper
                .convertValue(
                    mockActieverzoekResponse,
                    object : com.fasterxml.jackson.core.type.TypeReference<Map<String, Any?>>() {},
                )
        val mockJsonSchemaDocument = mockk<JsonSchemaDocument>()
        val mockActieverzoekId = UUID.randomUUID()
        val mockDocumentContent =
            JsonDocumentContent(
                """
                {
                    "samenwerkingProperties": {
                        "actieverzoekDetails": {
                            "actieverzoekId": "$mockActieverzoekId"
                        }
                    }
                }
                """.trimIndent(),
            )

        val mockPluginConfiguration =
            PluginConfiguration(
                id = PluginConfigurationId.newId(),
                title = "My super cool mock plugin",
                properties =
                    objectMapper.createObjectNode().apply {
                        put("baseUrl", "http://example.com")
                        put("certificate", "Don't tell anyone. Promise?")
                        put("oinNummer", "123456789")
                    },
                pluginDefinition = mockk<PluginDefinition>(),
            )

        every { samenwerkfunctionaliteitService.getActieverzoek(any(), any()) } returns mockActieverzoekResponse
        every { documentService.getDocumentBy(JsonSchemaDocumentId.existingId(mockumentId)) } returns
            mockJsonSchemaDocument
        every { mockJsonSchemaDocument.content() } returns mockDocumentContent
        every {
            pluginService
                .getPluginConfigurations(any<PluginConfigurationSearchParameters>())
        } returns
            listOf(mockPluginConfiguration)

        //  Act
        val resolver = factory.createResolver(documentId = mockumentId)
        val result = resolver.apply("actieverzoek")

        // Assert
        assertEquals(mappedMockActieverzoekResponse, result)

        verify { samenwerkfunctionaliteitService.getActieverzoek(any(), mockActieverzoekId) }
    }

    @Test
    fun `the returned function should throw an IllegalArgumentException if the requested value is not found`() {
        // Arrange
        val mockumentId = UUID.randomUUID().toString()
        val resolver = factory.createResolver(mockumentId)

        // Act and assert
        assertThrows<IllegalArgumentException> {
            resolver.apply("meat bals")
        }
    }

    @Test
    fun `createResolver(processInstanceId, variableScope) should lookup Document ID`() {
        //  Arrange
        val mockumentId = JsonSchemaDocumentId.existingId(UUID.randomUUID())
        val mockProcessInstanceId = UUID.randomUUID().toString()
        val mockVariableScope = mockk<VariableScope>()

        every {
            processDocumentService
                .getDocumentId(OperatonProcessInstanceId(mockProcessInstanceId), mockVariableScope)
        } returns mockumentId

        // Act
        factory.createResolver(mockProcessInstanceId, mockVariableScope)

        // Assert
        verify(exactly = 1) {
            processDocumentService.getDocumentId(
                OperatonProcessInstanceId(mockProcessInstanceId),
                mockVariableScope,
            )
        }
    }

    @Test
    fun `createResolver(processInstanceId, variableScope) should call createResolver(documentId)`() {
        //  Arrange
        val mockumentId = JsonSchemaDocumentId.existingId(UUID.randomUUID())
        val mockProcessInstanceId = UUID.randomUUID().toString()
        val mockVariableScope = mockk<VariableScope>()
        val mockJsonSchemaDocument = mockk<JsonSchemaDocument>()
        val mockDocumentContent =
            JsonDocumentContent(
                """
                {
                    "samenwerkingProperties": {
                        "samenwerkingId": "SAM-12345"
                    }
                }
                """.trimIndent(),
            )
        val mockPluginConfiguration =
            PluginConfiguration(
                id = PluginConfigurationId.newId(),
                title = "My super cool mock plugin",
                properties =
                    objectMapper.createObjectNode().apply {
                        put("baseUrl", "http://example.com")
                        put("certificate", "Don't tell anyone. Promise?")
                        put("oinNummer", "123456789")
                    },
                pluginDefinition = mockk<PluginDefinition>(),
            )
        val mockSamenwerkingResponse = MOCK_SAMENWERKING_RESPONSE

        every {
            processDocumentService
                .getDocumentId(OperatonProcessInstanceId(mockProcessInstanceId), mockVariableScope)
        } returns mockumentId
        every {
            documentService.getDocumentBy(mockumentId)
        } returns mockJsonSchemaDocument
        every { mockJsonSchemaDocument.content() } returns mockDocumentContent
        every {
            pluginService
                .getPluginConfigurations(any<PluginConfigurationSearchParameters>())
        } returns
            listOf(mockPluginConfiguration)
        every { samenwerkfunctionaliteitService.getSamenwerking(any(), any()) } returns mockSamenwerkingResponse

        // Act
        val resolver =
            factory.createResolver(
                processInstanceId = mockProcessInstanceId,
                variableScope = mockVariableScope,
            )
        resolver.apply("samenwerking")

        // Assert
        verify { documentService.getDocumentBy(mockumentId) }
    }

    @Test
    fun `createResolver(properties) should call createResolver(documentId)`() {
        //  Arrange
        val mockumentId = JsonSchemaDocumentId.existingId(UUID.randomUUID())
        val mockerties = mapOf(DOCUMENT_ID to mockumentId)
        val mockProcessInstanceId = UUID.randomUUID().toString()
        val mockVariableScope = mockk<VariableScope>()
        val mockJsonSchemaDocument = mockk<JsonSchemaDocument>()
        val mockDocumentContent =
            JsonDocumentContent(
                """
                {
                    "samenwerkingProperties": {
                        "samenwerkingId": "SAM-12345"
                    }
                }
                """.trimIndent(),
            )
        val mockPluginConfiguration =
            PluginConfiguration(
                id = PluginConfigurationId.newId(),
                title = "My super cool mock plugin",
                properties =
                    objectMapper.createObjectNode().apply {
                        put("baseUrl", "http://example.com")
                        put("certificate", "Don't tell anyone. Promise?")
                        put("oinNummer", "123456789")
                    },
                pluginDefinition = mockk<PluginDefinition>(),
            )
        val mockSamenwerkingResponse = MOCK_SAMENWERKING_RESPONSE

        every {
            processDocumentService
                .getDocumentId(OperatonProcessInstanceId(mockProcessInstanceId), mockVariableScope)
        } returns mockumentId
        every {
            documentService.getDocumentBy(mockumentId)
        } returns mockJsonSchemaDocument
        every { mockJsonSchemaDocument.content() } returns mockDocumentContent
        every {
            pluginService
                .getPluginConfigurations(any<PluginConfigurationSearchParameters>())
        } returns
            listOf(mockPluginConfiguration)
        every { samenwerkfunctionaliteitService.getSamenwerking(any(), any()) } returns mockSamenwerkingResponse

        // Act
        val resolver = factory.createResolver(properties = mockerties)
        resolver.apply("samenwerking")

        // Assert
        verify { documentService.getDocumentBy(mockumentId) }
    }

    @Test
    fun `getValueFromJsonDocument should return an empty string if no value is found`() {
//  Arrange
        val mockumentId = JsonSchemaDocumentId.existingId(UUID.randomUUID())
        val mockerties = mapOf(DOCUMENT_ID to mockumentId)
        val mockProcessInstanceId = UUID.randomUUID().toString()
        val mockVariableScope = mockk<VariableScope>()
        val mockJsonSchemaDocument = mockk<JsonSchemaDocument>()
        val mockDocumentContent =
            JsonDocumentContent(
                """
                {
                    "samenwerkingProperties": {
                        "no Samenwerking ID here!": ""
                    }
                }
                """.trimIndent(),
            )
        val mockPluginConfiguration =
            PluginConfiguration(
                id = PluginConfigurationId.newId(),
                title = "My super cool mock plugin",
                properties =
                    objectMapper.createObjectNode().apply {
                        put("baseUrl", "http://example.com")
                        put("certificate", "Don't tell anyone. Promise?")
                        put("oinNummer", "123456789")
                    },
                pluginDefinition = mockk<PluginDefinition>(),
            )
        val mockSamenwerkingResponse = MOCK_SAMENWERKING_RESPONSE

        every {
            processDocumentService
                .getDocumentId(OperatonProcessInstanceId(mockProcessInstanceId), mockVariableScope)
        } returns mockumentId
        every {
            documentService.getDocumentBy(mockumentId)
        } returns mockJsonSchemaDocument
        every { mockJsonSchemaDocument.content() } returns mockDocumentContent
        every {
            pluginService
                .getPluginConfigurations(any<PluginConfigurationSearchParameters>())
        } returns
            listOf(mockPluginConfiguration)
        every { samenwerkfunctionaliteitService.getSamenwerking(any(), any()) } returns mockSamenwerkingResponse

        // Act
        val resolver = factory.createResolver(properties = mockerties)
        resolver.apply("samenwerking")

        // Assert
        verify(exactly = 0) {
            samenwerkfunctionaliteitService.getSamenwerking(any(), any())
        }
    }

    @Test
    fun `getProperties() should correctly map plugin properties to SamenwerkfunctionaliteitProperties`() {
        // Arrange
        val mockumentId = JsonSchemaDocumentId.existingId(UUID.randomUUID())
        val mockSamenwerkingResponse = MOCK_SAMENWERKING_RESPONSE
        val mockJsonSchemaDocument = mockk<JsonSchemaDocument>()
        val mockDocumentContent =
            JsonDocumentContent(
                """
                {
                    "samenwerkingProperties": {
                        "samenwerkingId": "SAM-12345"
                    }
                }
                """.trimIndent(),
            )
        val pluginConfiguration =
            PluginConfiguration(
                id = PluginConfigurationId.newId(),
                title = "Test configuration",
                properties =
                    objectMapper.createObjectNode().apply {
                        put("baseUrl", "http://example.com")
                        put("certificate", "Don't tell anyone. Promise?")
                        put("oinNummer", "123456789")
                    },
                pluginDefinition = mockk<PluginDefinition>(),
            )
        val propertiesSlot = slot<SamenwerkfunctionaliteitProperties>()

        every {
            pluginService.getPluginConfigurations(
                any<PluginConfigurationSearchParameters>(),
            )
        } returns listOf(pluginConfiguration)
        every {
            documentService.getDocumentBy(mockumentId)
        } returns mockJsonSchemaDocument
        every { mockJsonSchemaDocument.content() } returns mockDocumentContent
        every {
            samenwerkfunctionaliteitService.getSamenwerking(
                any(),
                capture(propertiesSlot),
            )
        } returns mockSamenwerkingResponse

        // Act
        val resolver = factory.createResolver(documentId = mockumentId.toString())
        resolver.apply("samenwerking")

        // Assert
        assertEquals(URI.create("http://example.com"), propertiesSlot.captured.baseUrl)
        assertEquals("Don't tell anyone. Promise?", propertiesSlot.captured.certificate)
        assertEquals("123456789", propertiesSlot.captured.oinNummer)
    }

    @Test
    fun `getProperties() should throw a NotFoundException if no plugin configuration is found`() {
        // Arrange
        val mockumentId = JsonSchemaDocumentId.existingId(UUID.randomUUID())
        val mockJsonSchemaDocument = mockk<JsonSchemaDocument>()
        val mockDocumentContent =
            JsonDocumentContent(
                """
                {
                    "samenwerkingProperties": {
                        "samenwerkingId": "SAM-12345"
                    }
                }
                """.trimIndent(),
            )

        every {
            pluginService.getPluginConfigurations(
                any<PluginConfigurationSearchParameters>(),
            )
        } returns listOf()
        every {
            documentService.getDocumentBy(mockumentId)
        } returns mockJsonSchemaDocument
        every { mockJsonSchemaDocument.content() } returns mockDocumentContent

        // Act
        val resolver = factory.createResolver(documentId = mockumentId.toString())

        // Assert
        assertThrows<NotFoundException> {
            resolver.apply("samenwerking")
        }
    }

    @Test
    fun `handleValues(String, VariableScope, Map) should return Unit`() {
        // Arrange
        val mockProcessInstanceId = UUID.randomUUID().toString()
        val mockVariableScope = mockk<VariableScope>()
        val mockValues = mapOf<String, Any?>("six seven" to "skibidy toilet")

        val expectedResult = Unit

        // Act and assert
        assertEquals(expectedResult, factory.handleValues(mockProcessInstanceId, mockVariableScope, mockValues))
    }

    @Test
    fun `handleValues(String, Map) should return Unit`() {
        // Arrange
        val mockumentId = UUID.randomUUID()
        val mockValues = mapOf<String, Any?>("six seven" to "skibidy toilet")

        val expectedResult = Unit

        // Act and assert
        assertEquals(expectedResult, factory.handleValues(mockumentId, mockValues))
    }

    companion object {
        val MOCK_SAMENWERKING_RESPONSE =
            SamenwerkingResponse(
                _links =
                    mutableMapOf(
                        "self" to Link("https://example.com/samenwerkingen/SAM-66497"),
                        "documentToevoegen" to Link("https://example.com/samenwerkingen/SAM-66497/documenten"),
                        "actieverzoekOpstellen" to Link("https://example.com/samenwerkingen/SAM-66497/actieverzoeken"),
                        "actieverzoeken" to Link("https://example.com/actieverzoeken?samenwerkingId=SAM-66497"),
                    ),
                aangemaaktDoor = "00000001812579446000",
                aangemaaktDoorNaam = "Gemeente Westland",
                aantalActieverzoeken = 3,
                aantalNotificaties = 9,
                beschrijving =
                    "Beoordeling voorgenomen vestiging Bob's Burgers aan de Ocean Avenue. De GGD beoordeelt" +
                        "de gezondheidsrisico's en voedselveiligheidsaspecten. De gemeente beoordeelt de " +
                        "omgevingsvergunning en het gebruik van het pand. De omgevingsdienst onderzoekt mogelijke" +
                        " geur- en geluidsoverlast voor omwonenden.",
                bronVerzoek = "DSO_LV",
                contactpersoonEmailadres = "vergunningen@example.com",
                contactpersoonNaam = "Linda Belcher",
                contactpersoonTelefoonnummer = "0612345678",
                creatieDatumTijd = "2026-10-01T09:30:00+02:00",
                eindDatumTijd = "2027-04-01T17:00:00+02:00",
                globaleLocatie = "Ocean Avenue 12, 2671GW Naaldwijk",
                kenmerkSysteem = "Rx.Mission",
                laatstAangepastDatumTijd = "2026-10-20T14:15:00+02:00",
                laatstAangepastDoor = "00000001855322500000",
                laatstAangepastDoorNaam = "GGD Haaglanden",
                nummerBinnenSysteem = "Z2026-00000142",
                oloVerzoeknummer = "2026100100001",
                samenwerkDoel = "BEHANDELEN",
                samenwerkVorm = "SAMENWERKEN_AAN_BEHANDELEN",
                samenwerkingId = "SAM-66497",
                status = Status.OPEN,
                taal = "NL",
                titel = "Gezamenlijke beoordeling vergunningaanvraag Bob's Burgers",
                typeVerzoek = "Aanvraag exploitatievergunning en omgevingsvergunning",
                verzoeknummer = "2026100100012",
            )

        val MOCK_ACTIEVERZOEK_RESPONSE =
            ActieverzoekResponse(
                links =
                    mutableMapOf(
                        "self" to Link("https://example.com/actieverzoeken/8f4c2b1a-6d73-4e91-a52b-12d34e56f789"),
                        "samenwerking" to Link("https://example.com/samenwerkingen/SAM-66497"),
                        "documentToevoegen" to
                            Link(
                                "https://example.com/actieverzoeken/8f4c2b1a-6d73-4e91-a52b-12d34e56f789/documenten",
                            ),
                    ),
                aantalBerichten = 4,
                actieverzoekId = UUID.fromString("8f4c2b1a-6d73-4e91-a52b-12d34e56f789"),
                creatieDatumTijd = OffsetDateTime.parse("2026-10-02T10:15:00+02:00"),
                documenten = emptyList(),
                laatstAangepastDatumTijd = OffsetDateTime.parse("2026-10-20T14:15:00+02:00"),
                laatstAangepastDoor = "00000001855322500000",
                laatstAangepastDoorNaam = "GGD Haaglanden",
                melding =
                    "Graag beoordelen of de voorgenomen vestiging van Bob's Burgers voldoet aan de relevante " +
                        "gezondheids- en voedselveiligheidsvereisten.",
                omschrijving =
                    "Controleer de vergunningaanvraag voor het burgerrestaurant aan Ocean Avenue 12. " +
                        "Beoordeel de benodigde exploitatievergunning, het beoogde gebruik van het pand en eventuele " +
                        "aanvullende voorwaarden. Stem bevindingen af met de GGD en de omgevingsdienst.",
                ontvanger = "00000001812579446000",
                ontvangerNaam = "Gemeente Westland",
                productId = "PRODUCT-EXPLOITATIEVERGUNNING",
                samenwerkingId = "SAM-66497",
                status = Actieverzoek.ActieverzoekStatus.OPEN,
                titel = "Beoordelen vergunningaanvraag Bob's Burgers",
                zender = "00000001855322500000",
                zenderNaam = "GGD Haaglanden",
            )
    }
}
