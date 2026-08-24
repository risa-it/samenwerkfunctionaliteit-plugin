package com.ritense.valtimoplugins.samenwerkfunctionaliteit.service

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.ActieverzoekResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.BerichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.CreateBerichtRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtQuery
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.PagedBerichtenGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.PagedNotificatieGetResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.SamenwerkingResponse
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.UpdateActieverzoekRequest
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Actieverzoek
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Bericht
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Document
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Notificatie
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Page
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Samenwerking
import org.springframework.http.ResponseEntity
import org.springframework.web.multipart.MultipartFile
import java.time.ZonedDateTime
import java.util.UUID

interface SamenwerkfunctionaliteitService {
    fun getActieverzoek(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
    ): ActieverzoekResponse

    fun getAllActieverzoeken(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
        isOrganisationTheReceiver: Boolean,
    ): List<Actieverzoek>

    fun updateActieverzoek(
        properties: SamenwerkfunctionaliteitProperties,
        actieverzoekId: UUID,
        request: UpdateActieverzoekRequest,
    ): Actieverzoek

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

    fun getDocumenten(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
        query: DocumentenOverzichtQuery,
    ): List<Document>

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

    fun getSamenwerkingNotificaties(
        properties: SamenwerkfunctionaliteitProperties,
        samenwerkingId: String,
    ): List<Notificatie>

    fun getNotificaties(
        from: ZonedDateTime,
        until: ZonedDateTime,
        properties: SamenwerkfunctionaliteitProperties,
        pageNumber: Int,
    ): Page<List<Notificatie>>

    fun getAllNotificaties(properties: SamenwerkfunctionaliteitProperties): PagedNotificatieGetResponse

    fun getSamenwerking(
        samenwerkingId: String,
        properties: SamenwerkfunctionaliteitProperties,
    ): SamenwerkingResponse
}
