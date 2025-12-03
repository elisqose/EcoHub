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
    public ResponseEntity<List<Message>> getReceived(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getReceivedMessages(userId));
    }

    @GetMapping("/sent/{userId}")
    public ResponseEntity<List<Message>> getSent(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getSentMessages(userId));
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest request) {
        try {
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        try {
            messageService.deleteMessage(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Data
    public static class MessageRequest {
        private Long senderId;
        private String receiverUsername;
        private String content;
    }
}