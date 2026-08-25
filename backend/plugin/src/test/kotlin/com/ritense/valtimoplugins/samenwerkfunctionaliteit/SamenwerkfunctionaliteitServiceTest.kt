package com.ritense.valtimoplugins.samenwerkfunctionaliteit

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.client.SamenwerkfunctionaliteitClient
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Document
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Documenten
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtQuery
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.DefaultSamenwerkfunctionaliteitService
import org.junit.jupiter.api.DisplayName
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.net.URI
import java.time.OffsetDateTime
import java.util.UUID
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class SamenwerkfunctionaliteitServiceTest {
    private val client = mock<SamenwerkfunctionaliteitClient>()
    private val service = DefaultSamenwerkfunctionaliteitService(client)

    @Test
    @DisplayName("Should map documenten overzicht response to documents")
    fun shouldMapResponseToDocuments() {
        // Arrange
        val properties =
            SamenwerkfunctionaliteitProperties(
                baseUrl = URI("https://example.com"),
                certificate = "certificate",
                oinNummer = "oin-123",
            )
        val samenwerkingId = "SAM-123"
        val query =
            DocumentenOverzichtQuery(
                aangemaaktDoor = "user-id",
                negateAangemaaktDoor = "true",
                aangemaaktDoorNaam = "Chris",
                negateAangemaaktDoorNaam = "false",
                sort = "naam",
                aantal = "10",
                pagina = "1",
            )
        val documentId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val creatieDatumTijd = OffsetDateTime.parse("2026-01-01T00:00:00Z")
        val documentResponse =
            Document(
                documentId = documentId,
                bestandsNaam = "test.pdf",
                kenmerkSysteem = "kenmerk-systeem",
                nummerBinnenSysteem = "nummer-1",
                samenwerkingId = samenwerkingId,
                aangemaaktDoor = "user-id",
                aangemaaktDoorNaam = "Jan",
                creatieDatumTijd = creatieDatumTijd,
                laatstAangepastDoor = null,
                laatstAangepastDoorNaam = null,
                laatstAangepastDatumTijd = null,
                documentOmschrijving = "Test document",
                vertrouwelijkheidsAanduiding = null,
                taal = "nl",
                formaat = "application/pdf",
                documentHash = "hash-123",
            )
        val response =
            DocumentenOverzichtResponse(
                embedded =
                    Documenten(
                        documenten = listOf(documentResponse),
                    ),
            )

        whenever(
            client.getDocumentenOverzicht(
                properties,
                samenwerkingId,
                query,
            ),
        ).thenReturn(response)

        // Act
        val result =
            service.getDocumentenOverzicht(
                properties,
                samenwerkingId,
                query,
            )

        // Assert
        assertEquals(1, result.size)
        val document = result.single()
        assertEquals(documentId, document.documentId)
        assertEquals("test.pdf", document.bestandsNaam)
        assertEquals("kenmerk-systeem", document.kenmerkSysteem)
        assertEquals("nummer-1", document.nummerBinnenSysteem)
        assertEquals(samenwerkingId, document.samenwerkingId)
        assertEquals("user-id", document.aangemaaktDoor)
        assertEquals("Jan", document.aangemaaktDoorNaam)
        assertEquals(creatieDatumTijd, document.creatieDatumTijd)
        assertEquals("Test document", document.documentOmschrijving)
        assertEquals("nl", document.taal)
        assertEquals("application/pdf", document.formaat)
        assertEquals("hash-123", document.documentHash)

        verify(client).getDocumentenOverzicht(
            properties,
            samenwerkingId,
            query,
        )
    }

    @Test
    @DisplayName("Should return empty list when documenten overzicht response has no embedded documents")
    fun shouldReturnEmptyListWhenNoEmbeddedDocs() {
        // Arrange
        val properties =
            SamenwerkfunctionaliteitProperties(
                baseUrl = URI("https://example.com"),
                certificate = "certificate",
                oinNummer = "oin-123",
            )
        val samenwerkingId = "SAM-123"
        val query =
            DocumentenOverzichtQuery(
                aangemaaktDoor = "user-id",
                negateAangemaaktDoor = "true",
                aangemaaktDoorNaam = "Chris",
                negateAangemaaktDoorNaam = "false",
                sort = "naam",
                aantal = "10",
                pagina = "1",
            )
        val response = DocumentenOverzichtResponse(embedded = null)

        whenever(
            client.getDocumentenOverzicht(
                properties,
                samenwerkingId,
                query,
            ),
        ).thenReturn(response)

        // Act
        val result =
            service.getDocumentenOverzicht(
                properties,
                samenwerkingId,
                query,
            )

        // Assert
        assertTrue(result.isEmpty())
    }
}
