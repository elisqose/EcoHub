package com.ecohub.backend.service;

import com.ecohub.backend.model.*;
import com.ecohub.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// SERVICE 1: Gestione Utenti e Auth
@Service
public class UserService {
    @Autowired private UserRepository userRepository;
    @Autowired private MessageRepository messageRepository;

    public User login(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password)
                .orElseThrow(() -> new RuntimeException("Credenziali non valide"));
    }

    public User register(User user) {
        user.setRole(UserRole.STANDARD); // Default role
        return userRepository.save(user);
    }

    public void followUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId).orElseThrow();
        User followed = userRepository.findById(followedId).orElseThrow();
        if(!follower.getFollowing().contains(followed)) {
            follower.getFollowing().add(followed);
            userRepository.save(follower);
        }
    }

    public Message sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();
        Message msg = new Message(null, content, LocalDateTime.now(), sender, receiver);
        return messageRepository.save(msg);
    }

    public List<Message> getInbox(Long userId) {
        return messageRepository.findByReceiver_IdOrderByTimestampDesc(userId);
    }
}

// SERVICE 2: Gestione Contenuti (Post, Commenti, Tag)
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
        post.setStatus(PostStatus.PENDING); // Default: va in moderazione

        List<Tag> tags = new ArrayList<>();
        for(String name : tagNames) {
            tags.add(tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(new Tag(null, name))));
        }
        post.setTags(tags);
        return postRepository.save(post);
    }

    public List<Post> getPublicFeed() {
        return postRepository.findByStatusOrderByCreationDateDesc(PostStatus.APPROVED);
    }

    public Post getPostDetail(Long id) {
        return postRepository.findById(id).orElseThrow();
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
}

// SERVICE 3: Moderazione (EcoHub Specific)
@Service
public class ModerationService {
    @Autowired private PostRepository postRepository;

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
        post.setModeratorNote(note); // Aggiunge la nota per l'autore
        postRepository.save(post);
    }

    public void rejectPost(Long postId) {
        postRepository.deleteById(postId);
    }
}