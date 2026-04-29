// src/main/java/com/school/sms/model/Role.java

package com.school.sms.model;

public enum Role {
    ADMIN,    // Full access
    TEACHER,  // Can mark attendance, enter marks
    STUDENT   // Can view own data only
}