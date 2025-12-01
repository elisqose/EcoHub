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
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/received/{userId}")
    public ResponseEntity<List<Message>> getReceivedMessages(@PathVariable Long userId) {
        try {
            List<Message> messages = messageService.getMessagesForUser(userId);
            return ResponseEntity.ok(messages);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest request) {
        try {
            // --- MODIFICA QUI: Passiamo getReceiverUsername() ---
            Message sentMessage = messageService.sendMessage(
                    request.getSenderId(),
                    request.getReceiverUsername(),
                    request.getContent()
            );
            return ResponseEntity.ok(sentMessage);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Data
    public static class MessageRequest {
        private Long senderId;
        // --- MODIFICA QUI: Da Long receiverId a String receiverUsername ---
        private String receiverUsername;
        private String content;
    }
}