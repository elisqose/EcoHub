package com.ecohub.backend.repository;

import com.ecohub.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Per la Posta in Arrivo (Inbox)
    List<Message> findByReceiver_IdOrderByTimestampDesc(Long receiverId);

    // Per la Posta Inviata (Outbox) - AGGIUNTO
    List<Message> findBySender_IdOrderByTimestampDesc(Long senderId);
}