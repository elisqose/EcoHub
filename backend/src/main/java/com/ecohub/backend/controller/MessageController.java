package com.ecohub.backend.controller;

import com.ecohub.backend.model.Message;
import com.ecohub.backend.service.MessageService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173") // Abilita CORS per React/Vite
public class MessageController {

    @Autowired
    private MessageService messageService;

    // Endpoint per ottenere i messaggi ricevuti da un utente
    @GetMapping("/received/{userId}")
    public ResponseEntity<List<Message>> getReceivedMessages(@PathVariable Long userId) {
        try {
            List<Message> messages = messageService.getMessagesForUser(userId);
            return ResponseEntity.ok(messages);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint per inviare un messaggio
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest request) {
        try {
            Message sentMessage = messageService.sendMessage(
                    request.getSenderId(),
                    request.getReceiverId(),
                    request.getContent()
            );
            return ResponseEntity.ok(sentMessage);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DTO interno per la richiesta
    @Data
    public static class MessageRequest {
        private Long senderId;
        private Long receiverId;
        private String content;
    }
}