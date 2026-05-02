package com.school.sms.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    // Maps to store buckets for different purposes
    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> apiBuckets = new ConcurrentHashMap<>();

    // Login rate limit: 5 attempts per 15 minutes
    public Bucket resolveLoginBucket(String ip) {
        return loginBuckets.computeIfAbsent(ip, this::newLoginBucket);
    }

    // IP Throttling: 100 requests per minute
    public Bucket resolveApiBucket(String ip) {
        return apiBuckets.computeIfAbsent(ip, this::newApiBucket);
    }

    private Bucket newLoginBucket(String ip) {
        return Bucket4j.builder()
                .addLimit(Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(15))))
                .build();
    }

    private Bucket newApiBucket(String ip) {
        return Bucket4j.builder()
                .addLimit(Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1))))
                .build();
    }
}
