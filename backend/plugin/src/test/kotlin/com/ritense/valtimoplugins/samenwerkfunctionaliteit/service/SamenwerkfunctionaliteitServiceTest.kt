package com.ritense.valtimoplugins.samenwerkfunctionaliteit.service

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.client.SamenwerkfunctionaliteitClient
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekenGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Actieverzoek
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.net.URI
import java.util.UUID

class SamenwerkfunctionaliteitServiceTest {
    private lateinit var service: SamenwerkfunctionaliteitService
    private lateinit var mockClient: SamenwerkfunctionaliteitClient

    @BeforeEach
    fun setup() {
        mockClient = mockk()
        service = DefaultSamenwerkfunctionaliteitService(mockClient)
    }

    @Test
    fun `getActieverzoek maps response to model correctly`() {
        // Given
        val properties = SamenwerkfunctionaliteitProperties(URI("http://example.com"), "cert", "oin")
        val actieverzoekId = UUID.randomUUID()
        val response = ActieverzoekResponse()
        val expectedModel = Actieverzoek()

        every { mockClient.getActieverzoek(properties, actieverzoekId) } returns response

        // When
        val result = service.getActieverzoek(properties, actieverzoekId)

        // Then
        assert(result == expectedModel)
        verify(exactly = 1) { mockClient.getActieverzoek(properties, actieverzoekId) }
    }

    @Test
    fun `getAllActieverzoeken maps response list to model list correctly when isOrganisatieDeOntvanger is true`() {
        // Given
        val properties = SamenwerkfunctionaliteitProperties(URI("http://example.com"), "cert", "oin123")
        val samenwerkingId = "samenwerking123"
        val isOrganisatieDeOntvanger = true
        val responseList = ActieverzoekenGetResponse()
        val expectedModelList = listOf<Actieverzoek>()

        every { mockClient.getAllActieverzoeken(properties, samenwerkingId, properties.oinNummer) } returns responseList

        // When
        val result = service.getAllActieverzoeken(properties, samenwerkingId, isOrganisatieDeOntvanger)

        // Then
        assert(result == expectedModelList)
        verify(exactly = 1) {
            mockClient.getAllActieverzoeken(properties, samenwerkingId, properties.oinNummer)
        }
    }

    @Test
    fun `getAllActieverzoeken maps response list to model list correctly when isOrganisatieDeOntvanger is false`() {
        // Given
        val properties = SamenwerkfunctionaliteitProperties(URI("http://example.com"), "cert", "oin123")
        val samenwerkingId = "samenwerking123"
        val isOrganisatieDeOntvanger = false
        val responseList = ActieverzoekenGetResponse()
        val expectedModelList = listOf<Actieverzoek>()

        every { mockClient.getAllActieverzoeken(properties, samenwerkingId, null) } returns responseList

        // When
        val result = service.getAllActieverzoeken(properties, samenwerkingId, isOrganisatieDeOntvanger)

        // Then
        assert(result == expectedModelList)
        verify(exactly = 1) {
            mockClient.getAllActieverzoeken(properties, samenwerkingId, null)
        }
    }
}
