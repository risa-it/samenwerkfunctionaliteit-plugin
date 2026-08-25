package com.ritense.valtimoplugins.samenwerkfunctionaliteit.mapper

import com.ritense.valtimoplugins.samenwerkfunctionaliteit.model.Link
import com.ritense.valtimoplugins.samenwerkfunctionaliteit.dto.Link as LinkDTO

fun Link.toDTO() =
    LinkDTO(
        deprecation = deprecation,
        href = href,
        hreflang = hreflang,
        name = name,
        profile = profile,
        templated = templated,
        title = title,
        type = type,
    )

fun LinkDTO.toModel() =
    Link(
        deprecation = deprecation,
        href = href,
        hreflang = hreflang,
        name = name,
        profile = profile,
        templated = templated,
        title = title,
        type = type,
    )
