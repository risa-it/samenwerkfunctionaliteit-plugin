package com.ritense.valtimoplugins.samenwerkfunctionaliteit.client

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekenGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.BerichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.CreateBerichtRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtQuery
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.NotificatieGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.PagedNotificatieGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.core.io.InputStreamResource
import org.springframework.http.HttpStatus
import org.springframework.web.client.HttpServerErrorException
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestClientResponseException
import org.springframework.web.client.body
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.util.UriBuilder
import org.springframework.web.util.UriComponentsBuilder
import org.springframework.web.util.UriUtils
import java.nio.charset.StandardCharsets
import java.time.ZonedDateTime
import java.util.UUID
import kotlin.jvm.java

class DefaultSamenwerkfunctionaliteitClient(
    private val restClientBuilder: RestClient.Builder,
) : SamenwerkfunctionaliteitClient {
    private fun restClient(properties: SamenwerkfunctionaliteitProperties): RestClient =
        restClientBuilder
            .clone()
            .baseUrl(properties.baseUrl.toASCIIString())
            .defaultHeader("x-dienst", "ggd-hl")
            .build()

    override fun getActieverzoek(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
    ): ActieverzoekResponse {
        try {
            return restClient(properties = properties)
                .get()
                .uri("${SWF_ACTIEVERZOEK_PATH}/$actieverzoekId")
                .retrieve()
                .body<ActieverzoekResponse>()
                ?: throw IllegalStateException("Error fetching Actieverzoek: response body was null")
        } catch (e: HttpServerErrorException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: RestClientResponseException) {
            handleResponseException(e, "Error getting Actieverzoek.")
        }
    }

    override fun getAllActieverzoeken(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
        organisatie: String?,
    ): ActieverzoekenGetResponse {
        try {
            return restClient(properties = properties)
                .get()
                .uri { uriBuilder ->
                    uriBuilder
                        .path(SWF_ACTIEVERZOEK_PATH)
                        .queryParam(SAMENWERKING_ID, samenwerkingId)
                        .queryParamNotNull(name = ORGANISATIE, query = organisatie)
                        .build()
                }.retrieve()
                .body<ActieverzoekenGetResponse>()
                ?: throw IllegalStateException("Error fetching Actieverzoeken: response body was null")
        } catch (e: HttpServerErrorException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: RestClientResponseException) {
            handleResponseException(e, "Error getting all actieverzoeken.")
        }
    }

    override fun getBericht(
        properties: SamenwerkfunctionaliteitProperties,
        actieVerzoekId: UUID,
        berichtId: UUID,
    ): BerichtResponse {
        TODO("Not yet implemented")
    }

    override fun postBericht(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
        requestBody: CreateBerichtRequest,
    ): BerichtResponse {
        TODO("Not yet implemented")
    }

    override fun deleteBericht(
        properties: SamenwerkfunctionaliteitProperties,
        actieVerzoekId: UUID,
        berichtId: UUID,
    ) {
        TODO("Not yet implemented")
    }

    override fun getDocumentenOverzicht(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
        query: DocumentenOverzichtQuery,
    ): DocumentenOverzichtResponse =
        restClient(properties)
            .get()
            .uri { uriBuilder ->
                uriBuilder
                    .path("$SWF_SAMENWERKING_PATH/{samenwerkingId}/documenten")
                    .queryParamWithNegation(
                        DocumentenOverzichtQueryParam.AANGEMAAKT_DOOR,
                        query.aangemaaktDoor,
                        query.negateAangemaaktDoor,
                    ).queryParamWithNegation(
                        DocumentenOverzichtQueryParam.AANGEMAAKT_DOOR_NAAM,
                        query.aangemaaktDoorNaam,
                        query.negateAangemaaktDoorNaam,
                    ).queryParamIfNotNull(DocumentenOverzichtQueryParam.SORT, query.sort)
                    .queryParamIfNotNull(DocumentenOverzichtQueryParam.AANTAL, query.aantal)
                    .queryParamIfNotNull(DocumentenOverzichtQueryParam.PAGINA, query.pagina)
                    .build(samenwerkingId)
            }.retrieve()
            .body(DocumentenOverzichtResponse::class.java) ?: error("No list of Documents received.")

    override fun downloadDocument(
        properties: SamenwerkfunctionaliteitProperties,
        documentId: UUID,
    ): InputStreamResource {
        TODO("Not yet implemented")
    }

    override fun uploadDocument(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
    ) {
        TODO("Not yet implemented")
    }

    override fun getSamenwerkingNotificaties(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
    ): NotificatieGetResponse {
        try {
            return restClient(properties = properties)
                .get()
                .uri { uriBuilder ->
                    uriBuilder.path("$SWF_SAMENWERKING_PATH/$samenwerkingId/notificaties").build()
                }.retrieve()
                .body<NotificatieGetResponse>()
                ?: throw IllegalStateException("Error fetching notificaties: response body was null")
        } catch (e: HttpServerErrorException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: RestClientResponseException) {
            handleResponseException(e, "Error getting all notificaties.")
        }
    }

    override fun getNotificaties(
        from: ZonedDateTime,
        until: ZonedDateTime,
        properties: SamenwerkfunctionaliteitProperties,
        pageNumber: Int,
    ): PagedNotificatieGetResponse {
        val uri =
            UriComponentsBuilder
                .fromPath(NOTIFICATIES_ENDPOINT)
                .queryParam(
                    encodeQueryParam(EVENTDATUMTIJD_FROM_PARAM),
                    encodeQueryParam(from.toString()),
                ).queryParam(
                    encodeQueryParam(EVENTDATUMTIJD_UNTIL_PARAM),
                    encodeQueryParam(until.toString()),
                ).queryParam(NOTIFICATIES_PAGE_PARAM, pageNumber)
                .build(IS_ALREADY_ENCODED)
                .toUri()

        try {
            return restClient(properties = properties)
                .get()
                .uri(uri)
                .retrieve()
                .body<PagedNotificatieGetResponse>()
                ?: throw IllegalStateException("Error fetching notificaties: response body was null")
        } catch (e: HttpServerErrorException.InternalServerError) {
            handleInternalServerError(e)
        } catch (e: RestClientResponseException) {
            handleResponseException(e, "Error getting page $pageNumber of notificaties.")
        }
    }

    private fun encodeQueryParam(source: String): String = UriUtils.encode(source, StandardCharsets.UTF_8)

    private fun <T> UriBuilder.queryParamIfNotNull(
        name: DocumentenOverzichtQueryParam,
        value: T?,
    ) = queryParamNotNull(name.paramName, value)

    private fun <T> UriBuilder.queryParamNotNull(
        name: String,
        query: T?,
    ) = apply {
        if (query != null) {
            queryParam(name, query)
        }
    }

    private fun UriBuilder.queryParamWithNegation(
        name: DocumentenOverzichtQueryParam,
        value: String?,
        negate: String?,
    ) = apply {
        value
            ?.takeIf { it.isNotBlank() }
            ?.let { queryParam(if (negate.toBoolean()) name.negated() else name.paramName, it) }
    }

    private enum class DocumentenOverzichtQueryParam(
        val paramName: String,
    ) {
        AANGEMAAKT_DOOR("aangemaaktDoor"),
        AANGEMAAKT_DOOR_NAAM("aangemaaktDoorNaam"),
        SORT("_sort"),
        AANTAL("aantal"),
        PAGINA(
            "pagina",
        ), ;

        fun negated(): String = "$paramName[not]"
    }

    private fun handleInternalServerError(e: HttpServerErrorException.InternalServerError): Nothing {
        logger.warn { "Response body:  ${e.responseBodyAsString}" }
        logger.error(e) { "Internal Server Error calling SWF-API" }
        throw ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Internal Server Error calling OpenKlant",
            e,
        )
    }

    private fun handleResponseException(
        e: RestClientResponseException,
        reason: String,
    ): Nothing {
        logger.warn(e) { "Client error calling SWF-API" }
        logger.warn { "Response body:  ${e.responseBodyAsString}" }
        throw ResponseStatusException(
            e.statusCode,
            reason,
            e,
        )
    }

    companion object {
        private const val IS_ALREADY_ENCODED = true
        private const val NOTIFICATIES_ENDPOINT = "v5/notificaties"
        private const val EVENTDATUMTIJD_FROM_PARAM = "eventDatumTijd[gt]"
        private const val EVENTDATUMTIJD_UNTIL_PARAM = "eventDatumTijd[lte]"
        private const val NOTIFICATIES_PAGE_PARAM = "page"
        private const val SWF_SAMENWERKING_PATH = "v5/samenwerkingen"
        private const val SWF_ACTIEVERZOEK_PATH = "v5/actieverzoeken"
        private const val SAMENWERKING_ID = "samenwerkingId"
        private const val ORGANISATIE = "organisatie"
        private val logger = KotlinLogging.logger { }
    }
}
