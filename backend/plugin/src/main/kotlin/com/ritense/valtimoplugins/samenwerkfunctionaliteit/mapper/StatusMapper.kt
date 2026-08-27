package com.ritense.valtimoplugins.samenwerkfunctionaliteit.mapper

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Status
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Status as StatusDTO

fun StatusDTO.toModel(): Status =
    when (this) {
        StatusDTO.INITIALISATIE -> Status.INITIALISATIE
        StatusDTO.OPEN -> Status.OPEN
        StatusDTO.GESLOTEN -> Status.GESLOTEN
    }
