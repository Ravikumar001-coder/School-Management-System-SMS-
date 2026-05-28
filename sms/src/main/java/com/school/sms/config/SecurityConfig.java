package com.school.sms.config;

import com.school.sms.security.JwtAuthFilter;
import com.school.sms.security.JwtAuthEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
        .csrf(csrf -> csrf.disable())

        .cors(cors -> cors.configurationSource(request -> {
            var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                corsConfig.setAllowedOrigins(List.of(
                    frontendUrl,
                    "http://localhost:3000",
                    "http://127.0.0.1:3000"
                ));
                corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                corsConfig.setAllowedHeaders(List.of("*"));
                corsConfig.setExposedHeaders(List.of("Authorization"));
            corsConfig.setAllowCredentials(true);
                corsConfig.setMaxAge(3600L);
            return corsConfig;
        }))

        .exceptionHandling(ex -> ex
            .authenticationEntryPoint(jwtAuthEntryPoint)
        )

        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/v1/auth/logout").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/v1/auth/refresh").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/v1/parent/auth/**").permitAll()
            // Preflight
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            .requestMatchers("/api/v1/admin/**").hasAnyRole("ADMIN", "SUPERADMIN")
            .requestMatchers("/api/v1/parents/**").hasAnyRole("ADMIN", "SUPERADMIN", "PARENT")

            .requestMatchers(HttpMethod.GET, "/api/v1/students/**")
                .hasAnyRole("ADMIN", "TEACHER", "STUDENT", "PARENT")

            .requestMatchers(HttpMethod.POST, "/api/v1/students/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/v1/students/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/v1/students/**").hasRole("ADMIN")

            .requestMatchers(HttpMethod.POST, "/api/v1/fees/pay").hasRole("ADMIN")

            .requestMatchers("/api/v1/teachers/**")
                .hasAnyRole("ADMIN", "TEACHER")

            .requestMatchers("/api/v1/hrms/**")
                .hasAnyRole("ADMIN", "HR", "SUPERADMIN")

            .anyRequest().authenticated()
        )

        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )

        .authenticationProvider(authenticationProvider())
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }
}