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

    @GetMapping
    public List<Post> getFeed() {
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

    @PostMapping("/{id}/comments")
    public Comment addComment(@PathVariable Long id, @RequestParam Long userId, @RequestBody String text) {
        return contentService.addComment(id, userId, text);
    }

    @PostMapping("/{id}/support")
    public ResponseEntity<?> supportPost(@PathVariable Long id, @RequestParam Long userId) {
        contentService.addSupport(id, userId);
        return ResponseEntity.ok().build();
    }
}