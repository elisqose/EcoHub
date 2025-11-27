package com.ecohub.backend.controller;

import com.ecohub.backend.model.*;
import com.ecohub.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// CONTROLLER 1: Autenticazione (Gestione User Semplificata)
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permette chiamate da React
public class AuthController {
    @Autowired private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        try {
            User user = userService.login(creds.get("username"), creds.get("password"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Login fallito");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.register(user));
    }
}

// CONTROLLER 2: Contenuti (Public & User)
@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    @Autowired private ContentService contentService;

    // Route 1: Get Bacheca (Filtri opzionali possono essere aggiunti qui)
    @GetMapping
    public List<Post> getFeed() {
        return contentService.getPublicFeed();
    }

    // Route 2: Get Dettaglio Post
    @GetMapping("/{id}")
    public Post getPost(@PathVariable Long id) {
        return contentService.getPostDetail(id);
    }

    // Route 3: Crea Post (Richiede Body + Parametro Query per userId e Tags)
    @PostMapping
    public Post createPost(@RequestBody Post post, @RequestParam Long userId, @RequestParam List<String> tags) {
        return contentService.createPost(post, userId, tags);
    }

    // Route 4: Aggiungi Commento
    @PostMapping("/{id}/comments")
    public Comment addComment(@PathVariable Long id, @RequestParam Long userId, @RequestBody String text) {
        return contentService.addComment(id, userId, text);
    }

    // Route 5: Aggiungi Like/Supporto
    @PostMapping("/{id}/support")
    public ResponseEntity<?> supportPost(@PathVariable Long id, @RequestParam Long userId) {
        contentService.addSupport(id, userId);
        return ResponseEntity.ok().build();
    }
}

// CONTROLLER 3: Utente e Interazioni
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired private UserService userService;

    // Route 6: Segui utente
    @PostMapping("/{id}/follow")
    public ResponseEntity<?> follow(@RequestParam Long followerId, @PathVariable Long id) {
        userService.followUser(followerId, id);
        return ResponseEntity.ok().build();
    }

    // Route 7: Invia Messaggio
    @PostMapping("/messages")
    public Message sendMessage(@RequestParam Long senderId, @RequestParam Long receiverId, @RequestBody String content) {
        return userService.sendMessage(senderId, receiverId, content);
    }

    // Route 8: Leggi Inbox
    @GetMapping("/{id}/messages")
    public List<Message> getMessages(@PathVariable Long id) {
        return userService.getInbox(id);
    }
}

// CONTROLLER 4: Moderazione
@RestController
@RequestMapping("/api/moderation")
@CrossOrigin(origins = "*")
public class ModerationController {
    @Autowired private ModerationService moderationService;

    // Route 9: Get Coda Moderazione
    @GetMapping("/pending")
    public List<Post> getPending() {
        return moderationService.getPendingPosts();
    }

    // Route 10: Approva Post
    @PutMapping("/posts/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        moderationService.approvePost(id);
        return ResponseEntity.ok().build();
    }

    // Route 11: Richiedi Modifiche (Rimanda indietro)
    @PutMapping("/posts/{id}/request-changes")
    public ResponseEntity<?> requestChanges(@PathVariable Long id, @RequestBody String note) {
        moderationService.requestChanges(id, note);
        return ResponseEntity.ok().build();
    }

    // Route 12: Rifiuta/Cancella
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        moderationService.rejectPost(id);
        return ResponseEntity.ok().build();
    }
}