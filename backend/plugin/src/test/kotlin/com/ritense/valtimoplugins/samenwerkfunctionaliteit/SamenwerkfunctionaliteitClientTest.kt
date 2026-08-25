package com.ritense.valtimoplugins.samenwerkfunctionaliteit

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.client.DefaultSamenwerkfunctionaliteitClient
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtQuery
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import org.hamcrest.Matchers.containsString
import org.junit.jupiter.api.DisplayName
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.test.web.client.ExpectedCount
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers.method
import org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam
import org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo
import org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess
import org.springframework.web.client.RestClient
import java.net.URI
import kotlin.test.Test
import kotlin.test.assertFalse

class SamenwerkfunctionaliteitClientTest {
    val restClientBuilder = RestClient.builder()
    val server = MockRestServiceServer.bindTo(restClientBuilder).build()
    val client = DefaultSamenwerkfunctionaliteitClient(restClientBuilder)
    val properties =
        SamenwerkfunctionaliteitProperties(
            baseUrl = URI("https://example.com"),
            certificate = "certificate",
            oinNummer = "oin-123",
        )
    val samenwerkingId = "SAM-123"

    @Test
    @DisplayName("Should call documenten endpoint with query parameters")
    fun shouldCallEndpointWithQueryParams() {
        // Arrange
        val query =
            DocumentenOverzichtQuery(
                aangemaaktDoor = "user-id",
                negateAangemaaktDoor = "true",
                aangemaaktDoorNaam = "Jan",
                negateAangemaaktDoorNaam = "false",
                sort = "naam",
                aantal = "10",
                pagina = "1",
            )
        server
            .expect(
                ExpectedCount.once(),
                requestTo(containsString("https://example.com/v5/samenwerkingen/$samenwerkingId/documenten")),
            ).andExpect(method(HttpMethod.GET))
            .andExpect(queryParam("aangemaaktDoor%5Bnot%5D", "user-id"))
            .andExpect(queryParam("aangemaaktDoorNaam", "Jan"))
            .andExpect(queryParam("_sort", "naam"))
            .andExpect(queryParam("aantal", "10"))
            .andExpect(queryParam("pagina", "1"))
            .andRespond(
                withSuccess(
                    """
                    {
                        "_embedded": {
                            "documenten": []
                        }
                    }
                    """.trimIndent(),
                    MediaType.APPLICATION_JSON,
                ),
            )
        // Act
        client.getDocumentenOverzicht(
            properties,
            samenwerkingId,
            query,
        )
        // Assert
        server.verify()
    }

    @Test
    @DisplayName("Should not include blank or null filter query parameters")
    fun shouldNotIncludeBlankOrNullQueryParams() {
        // Arrange
        val query =
            DocumentenOverzichtQuery(
                aangemaaktDoor = null,
                negateAangemaaktDoor = "true",
                aangemaaktDoorNaam = "   ",
                negateAangemaaktDoorNaam = "true",
                sort = "naam",
                aantal = "10",
                pagina = "1",
            )

        server
            .expect(
                ExpectedCount.once(),
                requestTo(containsString("https://example.com/v5/samenwerkingen/$samenwerkingId/documenten")),
            ).andExpect(method(HttpMethod.GET))
            .andExpect(queryParam("_sort", "naam"))
            .andExpect(queryParam("aantal", "10"))
            .andExpect(queryParam("pagina", "1"))
            .andExpect { request ->
                val queryString = request.uri.query.orEmpty()
                assertFalse(queryString.contains("aangemaaktDoor"))
                assertFalse(queryString.contains("aangemaaktDoorNaam"))
            }.andRespond(
                withSuccess(
                    """
                    {
                        "_embedded": {
                            "documenten": []
                        }
                    }
                    """.trimIndent(),
                    MediaType.APPLICATION_JSON,
                ),
            )

        // Act
        client.getDocumentenOverzicht(
            properties,
            samenwerkingId,
            query,
        )

        // Assert
        server.verify()
    }
}
