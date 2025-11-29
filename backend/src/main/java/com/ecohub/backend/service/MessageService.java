package com.ecohub.backend.service;

import com.ecohub.backend.model.Message;
import com.ecohub.backend.model.User;
import com.ecohub.backend.repository.MessageRepository;
import com.ecohub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    // Metodo per inviare un messaggio
    public Message sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Mittente non trovato"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Destinatario non trovato"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }

    // Metodo per leggere i messaggi ricevuti da un utente
    public List<Message> getMessagesForUser(Long userId) {
        // Verifica se l'utente esiste (opzionale, ma buona pratica)
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Utente non trovato");
        }
        return messageRepository.findByReceiver_IdOrderByTimestampDesc(userId);
    }
}