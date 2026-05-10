// src/main/java/com/school/sms/model/User.java

package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@EqualsAndHashCode(exclude = "userRoles")
@ToString(exclude = "userRoles")
public class User implements UserDetails {

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
    private String password;
    
    private String role; // Denormalized role string (e.g., "ADMIN", "TEACHER")

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<UserRole> userRoles = new HashSet<>();

    @Builder.Default
    @Column(nullable = false)
    private boolean enabled = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean firstLogin = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        for (UserRole ur : userRoles) {
            Role r = ur.getRole();
            if (r != null) {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + r.getName().toUpperCase()));
                if (r.getPermissions() != null) {
                    r.getPermissions().forEach(p -> 
                        authorities.add(new SimpleGrantedAuthority(p.getPermissionKey().toUpperCase()))
                    );
                }
            }
        }
        return authorities;
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

    public boolean hasRole(String roleName) {
        if (userRoles == null) return false;
        return userRoles.stream()
                .anyMatch(ur -> ur.getRole() != null && ur.getRole().getName().equalsIgnoreCase(roleName));
    }

    public boolean isAdmin() { return hasRole("ADMIN") || hasRole("SUPERADMIN"); }
    public boolean isTeacher() { return hasRole("TEACHER"); }
    public boolean isStudent() { return hasRole("STUDENT"); }
}