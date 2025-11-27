package com.ecohub.backend.repository;

import com.ecohub.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // Trova messaggi scambiati tra due utenti o ricevuti da un utente
    List<Message> findByReceiver_IdOrderByTimestampDesc(Long receiverId);
}