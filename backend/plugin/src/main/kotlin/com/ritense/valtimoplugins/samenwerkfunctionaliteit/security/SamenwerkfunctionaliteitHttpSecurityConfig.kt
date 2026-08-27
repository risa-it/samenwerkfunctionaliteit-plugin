package com.ritense.valtimoplugins.samenwerkfunctionaliteit.security

import com.ritense.valtimo.contract.authentication.AuthoritiesConstants.ADMIN
import com.ritense.valtimo.contract.authentication.AuthoritiesConstants.USER
import com.ritense.valtimo.contract.security.config.HttpConfigurerConfigurationException
import com.ritense.valtimo.contract.security.config.HttpSecurityConfigurer
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.core.annotation.Order
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.stereotype.Component

@Order(1)
@Component
class SamenwerkfunctionaliteitHttpSecurityConfig : HttpSecurityConfigurer {
    override fun configure(http: HttpSecurity) {
        try {
            http
                .authorizeHttpRequests { requests ->
                    requests
                        .requestMatchers("api/v1/samenwerkfunctionaliteit/**")
                        .hasAnyAuthority(ADMIN, USER)
                }
        } catch (e: Exception) {
            throw HttpConfigurerConfigurationException(e)
        }
    }
}
