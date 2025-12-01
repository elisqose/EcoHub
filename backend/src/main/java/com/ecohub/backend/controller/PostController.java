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

    // ... (metodi esistenti: getFeed, getPost, createPost, updatePost, deletePost) ...
    @GetMapping
    public List<Post> getFeed(@RequestParam(required = false) String tag) {
        if (tag != null && !tag.isEmpty()) {
            return contentService.getPostsByTag(tag);
        }
        return contentService.getPublicFeed();
    }

    @GetMapping("/{id}")
    public Post getPost(@PathVariable Long id) {
        return contentService.getPostDetail(id);
    }

    @PostMapping
    public Post createPost(@RequestBody Post post, @RequestParam Long userId, @RequestParam List<String> tags) {
        return contentService.createPost(post, userId, tags);
    }

    @PutMapping("/{id}")
    public Post updatePost(@PathVariable Long id, @RequestParam Long userId, @RequestBody Post post) {
        return contentService.updatePost(id, userId, post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, @RequestParam Long userId) {
        contentService.deletePost(id, userId);
        return ResponseEntity.ok().build();
    }

    // --- COMMENTI ---
    @PostMapping("/{id}/comments")
    public Comment addComment(@PathVariable Long id, @RequestParam Long userId, @RequestBody String text) {
        return contentService.addComment(id, userId, text);
    }

    // --- NUOVO ENDPOINT: Elimina commento ---
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestParam Long userId) {
        try {
            contentService.deleteComment(commentId, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ... (metodi esistenti: supportPost, getUserPosts) ...
    @PostMapping("/{id}/support")
    public ResponseEntity<?> supportPost(@PathVariable Long id, @RequestParam Long userId) {
        contentService.addSupport(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public List<Post> getUserPosts(@PathVariable Long userId) {
        return contentService.getUserPosts(userId);
    }
}