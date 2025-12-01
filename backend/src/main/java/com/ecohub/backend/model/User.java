package com.ecohub.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String password;
    private String email;
    private String bio;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String profilePicture;

    @OneToMany(mappedBy = "receiver")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Message> receivedMessages;

    // --- MODIFICA 1: Lista FOLLOWING (Chi seguo io) ---
    @ManyToMany
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "follower_id"),
            inverseJoinColumns = @JoinColumn(name = "followed_id"))
    // Evitiamo che stampi all'infinito le liste degli utenti che seguo
    @JsonIgnoreProperties({"following", "followers", "password", "receivedMessages", "posts"})
    private List<User> following = new ArrayList<>();

    // --- MODIFICA 2: Lista FOLLOWERS (Chi segue me) ---
    @ManyToMany(mappedBy = "following")
    // Anche qui, evitiamo loop infiniti
    @JsonIgnoreProperties({"following", "followers", "password", "receivedMessages", "posts"})
    private List<User> followers = new ArrayList<>();
}