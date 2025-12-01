package com.ecohub.backend.controller;

import com.ecohub.backend.model.Message;
import com.ecohub.backend.model.User;
import com.ecohub.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired private UserService userService;

    @PostMapping("/{id}/follow")
    public ResponseEntity<?> follow(@RequestParam Long followerId, @PathVariable Long id) {
        userService.followUser(followerId, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/messages")
    public Message sendMessage(@RequestParam Long senderId, @RequestParam Long receiverId, @RequestBody String content) {
        return userService.sendMessage(senderId, receiverId, content);
    }

    @GetMapping("/{id}/messages")
    public List<Message> getMessages(@PathVariable Long id) {
        return userService.getInbox(id);
    }

    @GetMapping("/{id}")
    public User getUserProfile(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/search")
    public List<User> search(@RequestParam String query) {
        return userService.searchUsers(query);
    }

    @PutMapping("/{id}/picture")
    public ResponseEntity<?> updateProfilePicture(@PathVariable Long id, @RequestBody String base64Image) {
        userService.updateProfilePicture(id, base64Image);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/request-moderation")
    public ResponseEntity<?> requestModeration(@RequestBody Map<String, String> payload) {
        try {
            userService.requestModeration(payload.get("username"), payload.get("motivation"));
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/promote/{username}")
    public ResponseEntity<?> promoteUser(@PathVariable String username) {
        try {
            userService.promoteToModerator(username);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}