package com.ecohub.backend.repository;

import com.ecohub.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Metodo vecchio (solo ricevuti) - Puoi lasciarlo se lo usi ancora
    List<Message> findByReceiver_IdOrderByTimestampDesc(Long receiverId);

    // --- NUOVO METODO CHE MANCAVA ---
    // Trova messaggi dove l'utente è Mittente OPPURE Destinatario
    List<Message> findBySender_IdOrReceiver_IdOrderByTimestampDesc(Long senderId, Long receiverId);
}