package com.ecohub.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private LocalDateTime creationDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    // 1. RIMOSSO @JsonIgnore qui. Vogliamo vedere chi ha scritto il commento!
    // Usiamo JsonIgnoreProperties per evitare di scaricare tutto il profilo dell'utente (password, ecc.)
    @JsonIgnoreProperties({"password", "email", "posts", "receivedMessages", "followers", "following", "bio"})
    private User author;

    @ManyToOne
    @JoinColumn(name = "post_id")
    @com.fasterxml.jackson.annotation.JsonIgnore // 2. AGGIUNTO @JsonIgnore qui per evitare loop infiniti
    private Post post;
}