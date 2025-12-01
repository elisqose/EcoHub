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

    // Iniettiamo MessageService per inviare la notifica
    @Autowired private MessageService messageService;

    // ... (Mantieni i metodi createPost, updatePost, deletePost come sono) ...
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

    public Post updatePost(Long postId, Long userId, Post updatedData) {
        Post existingPost = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post non trovato"));
        if (!existingPost.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Non sei l'autore di questo post!");
        }
        existingPost.setTitle(updatedData.getTitle());
        existingPost.setContent(updatedData.getContent());
        if (updatedData.getImageUrl() != null && !updatedData.getImageUrl().isEmpty()) {
            existingPost.setImageUrl(updatedData.getImageUrl());
        }
        existingPost.setStatus(PostStatus.PENDING);
        existingPost.setModeratorNote(null);
        return postRepository.save(existingPost);
    }

    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post non trovato"));
        if (!post.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Non puoi cancellare post altrui!");
        }
        postRepository.delete(post);
    }

    // ... (Mantieni getPublicFeed, getPostDetail, getPostsByTag) ...
    public List<Post> getPublicFeed() {
        return postRepository.findByStatusOrderByCreationDateDesc(PostStatus.APPROVED);
    }

    public Post getPostDetail(Long id) {
        return postRepository.findById(id).orElseThrow();
    }

    public List<Post> getPostsByTag(String tagName) {
        return postRepository.findByTags_NameAndStatus(tagName, PostStatus.APPROVED);
    }

    // --- AGGIUNTA COMMENTO (Già presente, assicuriamoci funzioni) ---
    public Comment addComment(Long postId, Long userId, String text) {
        Post post = postRepository.findById(postId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        Comment comment = new Comment(null, text, LocalDateTime.now(), user, post);
        return commentRepository.save(comment);
    }

    // --- NUOVO METODO: ELIMINAZIONE COMMENTO ---
    public void deleteComment(Long commentId, Long requesterId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Commento non trovato"));

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        // Logica permessi: Può cancellare se è l'autore del commento OPPURE se è un Moderatore
        boolean isAuthor = comment.getAuthor().getId().equals(requesterId);
        boolean isModerator = requester.getRole() == UserRole.MODERATOR;

        if (!isAuthor && !isModerator) {
            throw new RuntimeException("Non hai i permessi per eliminare questo commento.");
        }

        // Se è un moderatore a cancellare il commento di qualcun altro -> INVIA NOTIFICA
        if (isModerator && !isAuthor) {
            User admin = userRepository.findByUsername("admin").orElse(requester); // Mittente del messaggio sistema
            String warningText = "⚠️ AVVISO DI MODERAZIONE\n\nIl tuo commento sotto il post '" +
                    comment.getPost().getTitle() + "' è stato rimosso perché ritenuto offensivo o non idoneo.\n\n" +
                    "Testo rimosso: \"" + comment.getText() + "\"";

            messageService.sendMessage(admin.getId(), comment.getAuthor().getUsername(), warningText);
        }

        commentRepository.delete(comment);
    }

    // ... (Mantieni addSupport, getUserPosts) ...
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