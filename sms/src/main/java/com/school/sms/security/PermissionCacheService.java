package com.school.sms.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PermissionCacheService {

    private final Map<String, UserDetails> userCache = new ConcurrentHashMap<>();

    public UserDetails getCachedUser(String identifier) {
        return userCache.get(identifier);
    }

    public void cacheUser(String identifier, UserDetails userDetails) {
        userCache.put(identifier, userDetails);
    }

    public void evictUser(String identifier) {
        userCache.remove(identifier);
    }

    public void evictAll() {
        userCache.clear();
    }
}
