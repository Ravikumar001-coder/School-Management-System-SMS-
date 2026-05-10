// src/main/java/com/school/sms/security/JwtService.java

package com.school.sms.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.List;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secretKey;

    /**
     * Access token expiry — MUST be short-lived (15 minutes = 900_000 ms).
     * Value is read from application.properties: app.jwt.expiration
     */
    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    @Value("${app.jwt.issuer:sms-api}")
    private String issuer;

    @Value("${app.jwt.audience:sms-frontend}")
    private String audience;

    // =============================================
    // Token Generation
    // =============================================

    public String generateToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, jwtExpiration);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        if (userDetails.getAuthorities() != null && !userDetails.getAuthorities().isEmpty()) {
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(authority -> authority.getAuthority())
                    .filter(authority -> authority.startsWith("ROLE_"))
                    .map(authority -> authority.substring("ROLE_".length()))
                    .collect(Collectors.toList());

            if (!roles.isEmpty()) {
                extraClaims.put("primaryRole", roles.get(0));
                extraClaims.put("roles", roles);
            }
        }

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setId(UUID.randomUUID().toString())       // jti — unique token ID (prevents replay)
                .setIssuer(issuer)                          // iss — who minted this token
                .setAudience(audience)                      // aud — who should accept it
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // =============================================
    // Token Validation
    // =============================================

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            final String tokenIssuer = extractClaim(token, Claims::getIssuer);
            final String tokenAudience = extractClaim(token, Claims::getAudience);

            return username.equals(userDetails.getUsername())
                    && !isTokenExpired(token)
                    && issuer.equals(tokenIssuer)
                    && audience.equals(tokenAudience);
        } catch (JwtException e) {
            return false;
        }
    }

    // =============================================
    // Claim Extraction
    // =============================================

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractJti(String token) {
        return extractClaim(token, Claims::getId);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
