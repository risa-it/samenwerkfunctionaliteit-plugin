package com.ritense.valtimoplugins.samenwerkfunctionaliteit.model

data class Samenwerking(
    val links: Map<String, Link> = mutableMapOf(),
    val aangemaaktDoor: String?,
    val aangemaaktDoorNaam: String?,
    val aantalActieverzoeken: Int?,
    val aantalNotificaties: Int?,
    val beschrijving: String?,
    val bronVerzoek: String?,
    val contactpersoonEmailadres: String?,
    val contactpersoonNaam: String?,
    val contactpersoonTelefoonnummer: String?,
    val creatieDatumTijd: String?,
    val eindDatumTijd: String?,
    val globaleLocatie: String?,
    val kenmerkSysteem: String?,
    val laatstAangepastDatumTijd: String?,
    val laatstAangepastDoor: String?,
    val laatstAangepastDoorNaam: String?,
    val nummerBinnenSysteem: String?,
    val oloVerzoeknummer: String?,
    val samenwerkDoel: String?,
    val samenwerkVorm: String?,
    val samenwerkingId: String?,
    val status: Status?,
    val taal: String?,
    val titel: String?,
    val typeVerzoek: String?,
    val verzoeknummer: String?,
)

enum class Status {
    INITIALISATIE,
    OPEN,
    GESLOTEN,
}
