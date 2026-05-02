package com.school.sms.dto.request;

/**
 * TokenRefreshRequest is intentionally empty.
 *
 * The refresh token is NO LONGER accepted in the request body.
 * It is transmitted exclusively via the HttpOnly cookie "refresh_token"
 * with Path=/api/v1/auth/refresh, Secure, SameSite=Strict.
 *
 * This class is kept as a tombstone comment to explain the design decision.
 * The POST /api/v1/auth/refresh endpoint reads the cookie directly from HttpServletRequest.
 */
public final class TokenRefreshRequest {
    private TokenRefreshRequest() {}
}
