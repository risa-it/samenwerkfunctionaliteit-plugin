package com.ritense.valtimoplugins.samenwerkfunctionaliteit.service

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.client.SamenwerkfunctionaliteitClient
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.CreateBerichtRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtQuery
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.mapper.toModel
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Actieverzoek
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Bericht
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Document
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Notificatie
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Page
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import org.springframework.core.io.InputStreamResource
import java.time.ZonedDateTime
import java.util.UUID

class DefaultSamenwerkfunctionaliteitService(
    private val samenwerkfunctionaliteitClient: SamenwerkfunctionaliteitClient,
) : SamenwerkfunctionaliteitService {
    override fun getActieverzoek(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
    ): Actieverzoek =
        samenwerkfunctionaliteitClient
            .getActieverzoek(
                properties = properties,
                actieverzoekId = actieverzoekId,
            ).toModel()

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

    override fun getBericht(
        properties: SamenwerkfunctionaliteitProperties,
        actieVerzoekId: UUID,
        berichtId: UUID,
    ): Bericht {
        TODO("Not yet implemented")
    }

    override fun postBericht(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
        requestBody: CreateBerichtRequest,
    ): Bericht {
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
            size = response.page.number,
            totalElements = response.page.number,
            totalPages = response.page.number,
        )
    }
}
