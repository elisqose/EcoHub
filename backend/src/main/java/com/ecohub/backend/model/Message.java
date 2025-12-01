package com.ecohub.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // <--- Importante
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 2000) // Allunghiamo un po' il testo possibile
    private String content;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    // Quando inviamo il messaggio, non vogliamo tutta la storia dei follower del mittente
    @JsonIgnoreProperties({"following", "followers", "receivedMessages", "password"})
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    // Idem per il destinatario
    @JsonIgnoreProperties({"following", "followers", "receivedMessages", "password"})
    private User receiver;
}