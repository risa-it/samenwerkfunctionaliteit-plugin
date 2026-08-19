package com.ritense.valtimoplugins.samenwerkfunctionaliteit.mapper

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Actieverzoek
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Actieverzoek as ActieverzoekDTO

fun ActieverzoekDTO.ActieverzoekStatus.toModel(): Actieverzoek.ActieverzoekStatus =
    when (this) {
        ActieverzoekDTO.ActieverzoekStatus.OPEN -> Actieverzoek.ActieverzoekStatus.OPEN
        ActieverzoekDTO.ActieverzoekStatus.IN_BEHANDELING -> Actieverzoek.ActieverzoekStatus.IN_BEHANDELING
        ActieverzoekDTO.ActieverzoekStatus.GEWEIGERD -> Actieverzoek.ActieverzoekStatus.GEWEIGERD
        ActieverzoekDTO.ActieverzoekStatus.INGETROKKEN -> Actieverzoek.ActieverzoekStatus.INGETROKKEN
        ActieverzoekDTO.ActieverzoekStatus.GEREEDGEMELD -> Actieverzoek.ActieverzoekStatus.GEREEDGEMELD
        ActieverzoekDTO.ActieverzoekStatus.GEREED -> Actieverzoek.ActieverzoekStatus.GEREED
    }
