package com.ecohub.backend.service;

import com.ecohub.backend.model.Post;
import com.ecohub.backend.model.PostStatus;
import com.ecohub.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModerationService {
    @Autowired
    private PostRepository postRepository;

    public List<Post> getPendingPosts() {
        return postRepository.findByStatus(PostStatus.PENDING);
    }

    public void approvePost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow();
        post.setStatus(PostStatus.APPROVED);
        post.setModeratorNote(null);
        postRepository.save(post);
    }

    public void requestChanges(Long postId, String note) {
        Post post = postRepository.findById(postId).orElseThrow();
        post.setStatus(PostStatus.REQUIRES_CHANGES);
        post.setModeratorNote(note);
        postRepository.save(post);
    }

    public void rejectPost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow();
        post.setStatus(PostStatus.REJECTED);
        post.setModeratorNote("Il contenuto viola le linee guida della community.");
        postRepository.save(post);
    }
}