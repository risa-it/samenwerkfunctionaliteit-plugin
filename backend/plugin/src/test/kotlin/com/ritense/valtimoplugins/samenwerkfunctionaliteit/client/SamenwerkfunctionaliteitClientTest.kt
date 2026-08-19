package com.ritense.valtimoplugins.samenwerkfunctionaliteit.client

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.util.queryParamNotNull
import io.mockk.Called
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.springframework.web.client.RestClient
import org.springframework.web.util.UriBuilder

class SamenwerkfunctionaliteitClientTest {
    private val mockRestClientBuilder = mockk<RestClient.Builder>(relaxed = true)
    private val client = DefaultSamenwerkfunctionaliteitClient(mockRestClientBuilder)

    @Test
    fun `queryParamNotNull should apply queryParam if not null`() {
        // Given
        val mockUriBuilder =
            mockk<UriBuilder> {
                every { queryParam("paramName", "testValue") } returns this
            }
        val name = "paramName"
        val queryValue = "testValue"

        // When
        val result = mockUriBuilder.queryParamNotNull(name, queryValue)

        // Then
        verify { mockUriBuilder.queryParam(name, queryValue) }
        assert(result == mockUriBuilder)
    }

    @Test
    fun `queryParamNotNull does not add query param when value is null`() {
        // Given
        val mockUriBuilder =
            mockk<UriBuilder> {
                every { queryParam(any(), any()) } returns this
            }
        val name = "paramName"
        val queryValue: String? = null

        // When
        mockUriBuilder.queryParamNotNull(name, queryValue)

        // Then
        verify { mockUriBuilder wasNot Called }
    }
}
