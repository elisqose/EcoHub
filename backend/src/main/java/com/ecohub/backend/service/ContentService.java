package com.ecohub.backend.service;

import com.ecohub.backend.model.*;
import com.ecohub.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ContentService {
    @Autowired private PostRepository postRepository;
    @Autowired private TagRepository tagRepository;
    @Autowired private CommentRepository commentRepository;
    @Autowired private SupportRepository supportRepository;
    @Autowired private UserRepository userRepository;

    public Post createPost(Post post, Long userId, List<String> tagNames) {
        User author = userRepository.findById(userId).orElseThrow();
        post.setAuthor(author);
        post.setCreationDate(LocalDateTime.now());
        post.setStatus(PostStatus.PENDING);

        List<Tag> tags = new ArrayList<>();
        for(String name : tagNames) {
            tags.add(tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(new Tag(null, name))));
        }
        post.setTags(tags);
        return postRepository.save(post);
    }

    // --- NUOVO: Modifica Post ---
    public Post updatePost(Long postId, Long userId, Post updatedData) {
        Post existingPost = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post non trovato"));

        // Controllo autore
        if (!existingPost.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Non sei l'autore di questo post!");
        }

        // Aggiorniamo i campi
        existingPost.setTitle(updatedData.getTitle());
        existingPost.setContent(updatedData.getContent());
        if (updatedData.getImageUrl() != null && !updatedData.getImageUrl().isEmpty()) {
            existingPost.setImageUrl(updatedData.getImageUrl());
        }

        // IMPORTANTE: Dopo una modifica, il post torna in moderazione!
        existingPost.setStatus(PostStatus.PENDING);
        existingPost.setModeratorNote(null); // Rimuoviamo la nota vecchia

        return postRepository.save(existingPost);
    }

    // --- NUOVO: Cancella Post ---
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post non trovato"));

        if (!post.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Non puoi cancellare post altrui!");
        }
        postRepository.delete(post);
    }

    // ... (Mantieni gli altri metodi: getPublicFeed, getPostDetail, getPostsByTag, addComment, addSupport, getUserPosts)
    public List<Post> getPublicFeed() {
        return postRepository.findByStatusOrderByCreationDateDesc(PostStatus.APPROVED);
    }

    public Post getPostDetail(Long id) {
        return postRepository.findById(id).orElseThrow();
    }

    public List<Post> getPostsByTag(String tagName) {
        return postRepository.findByTags_NameAndStatus(tagName, PostStatus.APPROVED);
    }

    public Comment addComment(Long postId, Long userId, String text) {
        Post post = postRepository.findById(postId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        Comment comment = new Comment(null, text, LocalDateTime.now(), user, post);
        return commentRepository.save(comment);
    }

    public void addSupport(Long postId, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        if(!supportRepository.existsByUserAndPost(user, post)) {
            supportRepository.save(new Support(null, user, post));
        }
    }

    public List<Post> getUserPosts(Long userId) {
        return postRepository.findByAuthor_Id(userId);
    }
}