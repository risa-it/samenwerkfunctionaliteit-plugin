package com.ritense.valtimoplugins.samenwerkfunctionaliteit.client

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekenGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.BerichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.CreateBerichtRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtQuery
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.NotificatieGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.PagedBerichtenGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.PagedNotificatieGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.SamenwerkingResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.UpdateActieverzoekRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import org.springframework.http.ResponseEntity
import org.springframework.web.multipart.MultipartFile
import java.time.ZonedDateTime
import java.util.UUID

interface SamenwerkfunctionaliteitClient {
    fun getActieverzoek(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
    ): ActieverzoekResponse

    fun getAllActieverzoeken(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
        organisatie: String?,
    ): ActieverzoekenGetResponse

    fun updateActieverzoek(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
        request: UpdateActieverzoekRequest,
    ): ActieverzoekResponse

    fun getBerichten(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
    ): PagedBerichtenGetResponse

    fun postBericht(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
        requestBody: CreateBerichtRequest,
    ): BerichtResponse

    fun deleteBericht(
        properties: SamenwerkfunctionaliteitProperties,
        actieVerzoekId: UUID,
        berichtId: UUID,
    )

    fun getDocumentenOverzicht(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
        query: DocumentenOverzichtQuery,
    ): DocumentenOverzichtResponse

    fun getDocumentenOverzicht(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
    ): DocumentenOverzichtResponse

    fun downloadDocument(
        properties: SamenwerkfunctionaliteitProperties,
        documentId: UUID,
    ): ResponseEntity<ByteArray>

    fun uploadDocument(
        properties: SamenwerkfunctionaliteitProperties,
        file: MultipartFile,
        metadata: Map<String, String>?,
        samenwerkingId: String,
    )

    fun deleteDocument(
        properties: SamenwerkfunctionaliteitProperties,
        documentId: String,
    )

    fun getSamenwerkingNotificaties(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
    ): NotificatieGetResponse

    fun getNotificaties(
        from: ZonedDateTime,
        until: ZonedDateTime,
        properties: SamenwerkfunctionaliteitProperties,
        pageNumber: Int,
    ): PagedNotificatieGetResponse

    fun getAllNotificaties(
        properties: SamenwerkfunctionaliteitProperties,
        page: Int?,
        amount: Int?,
        samenwerkingId: String,
    ): PagedNotificatieGetResponse

    fun getSamenwerking(
        samenwerkingId: String,
        properties: SamenwerkfunctionaliteitProperties,
    ): SamenwerkingResponse
}
