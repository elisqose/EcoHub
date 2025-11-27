package com.ecohub.backend.model;

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

    @OneToMany(mappedBy = "receiver")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Message> receivedMessages;

    @ManyToMany
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "follower_id"),
            inverseJoinColumns = @JoinColumn(name = "followed_id"))
    private List<User> following = new ArrayList<>();
}