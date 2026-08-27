package com.ritense.valtimoplugins.samenwerkfunctionaliteit.plugin

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.DocumentenOverzichtQuery
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.SamenwerkfunctionaliteitProperties
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.OperatonService
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.service.SamenwerkfunctionaliteitService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.operaton.bpm.engine.delegate.DelegateExecution
import java.net.URI
import java.util.UUID

@Plugin(
    key = "samenwerkfunctionaliteit",
    title = "DSO-Samenwerkfunctionaliteit Plugin",
    description = "DSO-Samenwerkfunctionaliteit Plugin",
)
@Suppress("UNUSED")
class SamenwerkfunctionaliteitPlugin(
    private val samenwerkfunctionaliteitService: SamenwerkfunctionaliteitService,
    private val operatonService: OperatonService,
) {
    @PluginProperty(key = "baseUrl", secret = false, required = true)
    lateinit var baseUrl: URI

    @PluginProperty(key = "certificate", secret = true, required = true)
    lateinit var certificate: String

    @PluginProperty(key = "oinNummer", secret = false, required = true)
    lateinit var oinNummer: String

    @PluginAction(
        key = "get-actieverzoek",
        title = "Get actieverzoek",
        description = "Haal het actieverzoek op.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getActieverzoek(
        execution: DelegateExecution,
        @PluginActionProperty resultPvName: String,
        @PluginActionProperty actieverzoekId: UUID,
    ) {
        val properties =
            SamenwerkfunctionaliteitProperties(
                baseUrl = baseUrl,
                certificate = certificate,
                oinNummer = oinNummer,
            )

        val actieverzoek =
            this.samenwerkfunctionaliteitService.getActieverzoek(
                properties = properties,
                actieverzoekId = actieverzoekId,
            )

        operatonService.saveToOperaton(
            execution = execution,
            resultPvName = resultPvName,
            result = actieverzoek,
        )
    }

    @PluginAction(
        key = "get-all-actieverzoeken",
        title = "Get all actieverzoeken",
        description = "Haal de actieverzoeken van de deelnemer op.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getAllActieverzoeken(
        execution: DelegateExecution,
        @PluginActionProperty resultPvName: String,
        @PluginActionProperty samenwerkingId: String,
        @PluginActionProperty isOrganisationTheReceiver: Boolean = true,
    ) {
        val properties =
            SamenwerkfunctionaliteitProperties(
                baseUrl = baseUrl,
                certificate = certificate,
                oinNummer = oinNummer,
            )

        val actieverzoeken =
            this.samenwerkfunctionaliteitService.getAllActieverzoeken(
                properties = properties,
                samenwerkingId = samenwerkingId,
                isOrganisationTheReceiver = isOrganisationTheReceiver,
            )

        operatonService.saveToOperaton(
            execution = execution,
            resultPvName = resultPvName,
            result = actieverzoeken,
        )
    }

    @PluginAction(
        key = "get-bericht",
        title = "Get bericht",
        description = "Haal een bericht op.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getBericht() {
    }

    @PluginAction(
        key = "post-bericht",
        title = "Post bericht",
        description = "Maak een bericht aan.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun postBericht() {
    }

    @PluginAction(
        key = "delete-bericht",
        title = "Delete bericht",
        description = "Verwijder een bericht.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun deleteBericht() {
    }

    @PluginAction(
        key = "get-documentenoverzicht",
        title = "Get documenten overzicht",
        description = "Haal een overzicht van documenten in de samenwerking op.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getDocumentenOverzicht(
        execution: DelegateExecution,
        @PluginActionProperty resultPvName: String,
        @PluginActionProperty samenwerkingId: String,
        @PluginActionProperty aangemaaktDoor: String?,
        @PluginActionProperty negateAangemaaktDoor: String?,
        @PluginActionProperty aangemaaktDoorNaam: String?,
        @PluginActionProperty negateAangemaaktDoorNaam: String?,
        @PluginActionProperty sort: String?,
        @PluginActionProperty aantal: String?,
        @PluginActionProperty pagina: String?,
    ) {
        logger.info { "Retrieveing Documents..." }
        val properties =
            SamenwerkfunctionaliteitProperties(
                baseUrl = this.baseUrl,
                certificate = this.certificate,
                oinNummer = this.oinNummer,
            )
        val query =
            DocumentenOverzichtQuery(
                aangemaaktDoor = aangemaaktDoor,
                negateAangemaaktDoor = (negateAangemaaktDoor ?: false).toString(),
                aangemaaktDoorNaam = aangemaaktDoorNaam,
                negateAangemaaktDoorNaam = (negateAangemaaktDoorNaam ?: false).toString(),
                sort = sort,
                aantal = aantal,
                pagina = pagina,
            )
        val documentenOverzicht =
            samenwerkfunctionaliteitService.getDocumenten(
                properties,
                samenwerkingId,
                query,
            )
        operatonService.saveToOperaton(execution, resultPvName, documentenOverzicht)
        logger.info { "Successfully retrieved list of Documents." }
    }

    @PluginAction(
        key = "download-document",
        title = "Download document",
        description = "Download het document.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun downloadDocument() {
    }

    @PluginAction(
        key = "upload-document",
        title = "Upload document",
        description = "Voeg een document toe aan de samenwerking.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun uploadDocument() {
    }

    @PluginAction(
        key = "get-samenwerking-notificaties",
        title = "Get samenwerking notificaties",
        description = "Haal de bij de samenwerking horende notificaties van de deelnemer op.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getSamenwerkingNotificaties(
        execution: DelegateExecution,
        @PluginActionProperty resultPvName: String,
        @PluginActionProperty samenwerkingId: String,
    ) {
        val properties =
            SamenwerkfunctionaliteitProperties(
                baseUrl = baseUrl,
                certificate = certificate,
                oinNummer = oinNummer,
            )

        val notificaties =
            this.samenwerkfunctionaliteitService.getSamenwerkingNotificaties(
                properties = properties,
                samenwerkingId = samenwerkingId,
            )

        operatonService.saveToOperaton(
            execution = execution,
            resultPvName = resultPvName,
            result = notificaties,
        )
    }

    companion object {
        private val logger = KotlinLogging.logger { }
        private val objectMapper = jacksonObjectMapper().findAndRegisterModules()
    }
}
