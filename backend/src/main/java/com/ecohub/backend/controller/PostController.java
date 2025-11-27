package com.ecohub.backend.controller;

import com.ecohub.backend.model.Comment;
import com.ecohub.backend.model.Post;
import com.ecohub.backend.service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    @Autowired
    private ContentService contentService;

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