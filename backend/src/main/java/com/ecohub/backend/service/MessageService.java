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

    public Message sendMessage(Long senderId, String receiverUsername, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Mittente non trovato"));

        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Destinatario non trovato: " + receiverUsername));

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("Non puoi inviarti messaggi da solo.");
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }

    // --- MODIFICA: Recupera l'intera storia (Inviati + Ricevuti) ---
    public List<Message> getMessagesForUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Utente non trovato");
        }
        // Passiamo l'ID due volte perché cerchiamo (Sender=ID) OR (Receiver=ID)
        return messageRepository.findBySender_IdOrReceiver_IdOrderByTimestampDesc(userId, userId);
    }

    public void deleteMessage(Long messageId) {
        messageRepository.deleteById(messageId);
    }
}