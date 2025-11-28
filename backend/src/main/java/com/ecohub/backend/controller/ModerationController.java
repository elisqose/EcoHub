package com.ecohub.backend.controller;

import com.ecohub.backend.model.Post;
import com.ecohub.backend.service.ModerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/moderation")
@CrossOrigin(origins = "*")

public class ModerationController {
    @Autowired private ModerationService moderationService;

    @GetMapping("/pending")
    public List<Post> getPending() {
        return moderationService.getPendingPosts();
    }

    @PutMapping("/posts/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        moderationService.approvePost(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/posts/{id}/request-changes")
    public ResponseEntity<?> requestChanges(@PathVariable Long id, @RequestBody String note) {
        moderationService.requestChanges(id, note);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        moderationService.rejectPost(id);
        return ResponseEntity.ok().build();
    }
}