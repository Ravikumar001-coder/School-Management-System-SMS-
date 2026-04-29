// src/main/java/com/school/sms/model/User.java

package com.school.sms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data                    // Lombok: generates getters, setters, toString
@Builder                 // Lombok: Builder pattern
@NoArgsConstructor       // Lombok: empty constructor
@AllArgsConstructor      // Lombok: all args constructor
@Entity                  // JPA: this is a database table
@Table(name = "users")   // JPA: table name
public class User implements UserDetails {  // Spring Security interface

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true)
    private String username;

    @Column(nullable = false)
    private String password;  // This will be HASHED, never plain text

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;  // ADMIN, TEACHER, STUDENT

    @Builder.Default
    @Column(nullable = false)
    private boolean enabled = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean firstLogin = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist  // Called before saving to DB
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate   // Called before updating in DB
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ========================
    // Spring Security Methods
    // ========================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Returns what role this user has
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return (username != null && !username.isBlank()) ? username : email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return enabled; }
}