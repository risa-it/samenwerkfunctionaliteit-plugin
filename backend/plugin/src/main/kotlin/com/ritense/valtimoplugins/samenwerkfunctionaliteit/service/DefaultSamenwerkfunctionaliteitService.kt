package com.ritense.valtimoplugins.samenwerkfunctionaliteit.service

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.client.SamenwerkfunctionaliteitClient
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.BerichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.CreateBerichtRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtQuery
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.PagedBerichtenGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.PagedNotificatieGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.SamenwerkingResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.UpdateActieverzoekRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.mapper.toModel
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Actieverzoek
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Document
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Notificatie
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Page
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import org.springframework.http.ResponseEntity
import org.springframework.web.multipart.MultipartFile
import java.time.ZonedDateTime
import java.util.UUID

class DefaultSamenwerkfunctionaliteitService(
    private val samenwerkfunctionaliteitClient: SamenwerkfunctionaliteitClient,
) : SamenwerkfunctionaliteitService {
    override fun getActieverzoek(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
    ): ActieverzoekResponse =
        samenwerkfunctionaliteitClient
            .getActieverzoek(
                properties = properties,
                actieverzoekId = actieverzoekId,
            )

    override fun getAllActieverzoeken(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
        isOrganisationTheReceiver: Boolean,
    ): List<Actieverzoek> {
        val organisatie = if (isOrganisationTheReceiver) properties.oinNummer else null
        return samenwerkfunctionaliteitClient
            .getAllActieverzoeken(
                properties = properties,
                samenwerkingId = samenwerkingId,
                organisatie = organisatie,
            ).toModel()
    }

    override fun updateActieverzoek(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
        request: UpdateActieverzoekRequest,
    ): ActieverzoekResponse =
        samenwerkfunctionaliteitClient
            .updateActieverzoek(
                properties = properties,
                actieverzoekId = actieverzoekId,
                request = request,
            )

    override fun getBerichten(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
    ): PagedBerichtenGetResponse =
        samenwerkfunctionaliteitClient.getBerichten(
            properties = properties,
            actieverzoekId = actieverzoekId,
        )

    override fun postBericht(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
        requestBody: CreateBerichtRequest,
    ): BerichtResponse =
        samenwerkfunctionaliteitClient.postBericht(
            properties = properties,
            actieverzoekId = actieverzoekId,
            requestBody = requestBody,
        )

    override fun deleteBericht(
        properties: SamenwerkfunctionaliteitProperties,
        actieVerzoekId: UUID,
        berichtId: UUID,
    ) {
        TODO("Not yet implemented")
    }

    override fun getDocumenten(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
        query: DocumentenOverzichtQuery,
    ): List<Document> =
        samenwerkfunctionaliteitClient
            .getDocumentenOverzicht(
                properties,
                samenwerkingId,
                query,
            ).embedded
            ?.documenten
            ?.map { it.toModel() }
            ?: emptyList()

    override fun getDocumentenOverzicht(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
    ): DocumentenOverzichtResponse =
        samenwerkfunctionaliteitClient
            .getDocumentenOverzicht(
                properties,
                samenwerkingId,
            )

    override fun downloadDocument(
        properties: SamenwerkfunctionaliteitProperties,
        documentId: UUID,
    ): ResponseEntity<ByteArray> = samenwerkfunctionaliteitClient.downloadDocument(properties, documentId)

    override fun uploadDocument(
        properties: SamenwerkfunctionaliteitProperties,
        file: MultipartFile,
        metadata: Map<String, String>?,
        samenwerkingId: String,
    ) = samenwerkfunctionaliteitClient.uploadDocument(
        properties = properties,
        file = file,
        metadata = metadata,
        samenwerkingId = samenwerkingId,
    )

    override fun getSamenwerkingNotificaties(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
    ): List<Notificatie> =
        samenwerkfunctionaliteitClient
            .getSamenwerkingNotificaties(
                properties,
                samenwerkingId,
            ).embedded
            ?.notificaties
            ?.map { it.toModel() }
            ?: emptyList()

    override fun getNotificaties(
        from: ZonedDateTime,
        until: ZonedDateTime,
        properties: SamenwerkfunctionaliteitProperties,
        pageNumber: Int,
    ): Page<List<Notificatie>> {
        val response =
            samenwerkfunctionaliteitClient
                .getNotificaties(
                    from = from,
                    until = until,
                    properties = properties,
                    pageNumber = pageNumber,
                )

        val notificaties =
            response.embedded
                ?.notificaties
                ?.map {
                    it.toModel()
                } ?: emptyList()

        return Page(
            item = notificaties,
            number = response.page.number,
            size = response.page.size,
            totalElements = response.page.totalElements,
            totalPages = response.page.totalPages,
        )
    }

    override fun getAllNotificaties(
        properties: SamenwerkfunctionaliteitProperties,
        page: Int?,
        amount: Int?,
    ): PagedNotificatieGetResponse =
        samenwerkfunctionaliteitClient
            .getAllNotificaties(
                properties = properties,
                page = page,
                amount = amount,
            )

    override fun getSamenwerking(
        samenwerkingId: String,
        properties: SamenwerkfunctionaliteitProperties,
    ): SamenwerkingResponse = samenwerkfunctionaliteitClient.getSamenwerking(samenwerkingId, properties)
}
