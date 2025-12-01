package com.ecohub.backend.repository;

import com.ecohub.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // --- NUOVO METODO UNICO PER LA CRONOLOGIA (INVIATI + RICEVUTI) ---
    // Cerca i messaggi dove l'utente è il mittente (Sender) OPPURE il destinatario (Receiver)
    List<Message> findBySender_IdOrReceiver_IdOrderByTimestampDesc(Long senderId, Long receiverId);
}