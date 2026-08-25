package com.ritense.valtimoplugins.samenwerkfunctionaliteit.util

import org.springframework.web.util.UriBuilder

fun <T> UriBuilder.queryParamNotNull(
    name: String,
    query: T?,
) = apply {
    if (query != null) {
        queryParam(name, query)
    }
}
