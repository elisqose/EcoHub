package com.ecohub.backend.repository;

import com.ecohub.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Assicurati che questa riga sia identica, incluse le maiuscole/minuscole
    List<Message> findByReceiver_IdOrderByTimestampDesc(Long receiverId);
}