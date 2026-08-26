package com.ritense.valtimoplugins.samenwerkfunctionaliteit.service

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.client.SamenwerkfunctionaliteitClient
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.BerichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.CreateBerichtRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.PagedBerichtenGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.PagedNotificatieGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.SamenwerkingResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.UpdateActieverzoekRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import org.springframework.http.ResponseEntity
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

class SamenwerkfunctionaliteitProxyService(
    private val samenwerkfunctionaliteitClient: SamenwerkfunctionaliteitClient,
) {
    fun getActieverzoek(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
    ): ActieverzoekResponse =
        samenwerkfunctionaliteitClient
            .getActieverzoek(
                properties = properties,
                actieverzoekId = actieverzoekId,
            )

    fun updateActieverzoek(
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

    fun getBerichten(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
    ): PagedBerichtenGetResponse =
        samenwerkfunctionaliteitClient.getBerichten(
            properties = properties,
            actieverzoekId = actieverzoekId,
        )

    fun postBericht(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
        requestBody: CreateBerichtRequest,
    ): BerichtResponse =
        samenwerkfunctionaliteitClient.postBericht(
            properties = properties,
            actieverzoekId = actieverzoekId,
            requestBody = requestBody,
        )

    fun getDocumentenOverzicht(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
    ): DocumentenOverzichtResponse =
        samenwerkfunctionaliteitClient
            .getDocumentenOverzicht(
                properties,
                samenwerkingId,
            )

    fun downloadDocument(
        properties: SamenwerkfunctionaliteitProperties,
        documentId: UUID,
    ): ResponseEntity<ByteArray> = samenwerkfunctionaliteitClient.downloadDocument(properties, documentId)

    fun uploadDocument(
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

    fun getAllNotificaties(
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

    fun getSamenwerking(
        samenwerkingId: String,
        properties: SamenwerkfunctionaliteitProperties,
    ): SamenwerkingResponse = samenwerkfunctionaliteitClient.getSamenwerking(samenwerkingId, properties)
}
