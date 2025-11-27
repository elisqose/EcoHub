package com.ecohub.backend.repository;

import com.ecohub.backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndPassword(String username, String password);
}

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Trova solo i post approvati (per la bacheca pubblica)
    List<Post> findByStatusOrderByCreationDateDesc(PostStatus status);

    // Trova i post per tag (solo approvati)
    List<Post> findByTags_NameAndStatus(String tagName, PostStatus status);

    // Trova i post di un utente specifico
    List<Post> findByAuthor_Id(Long userId);

    // Cerca nel titolo o contenuto (solo approvati)
    List<Post> findByTitleContainingOrContentContainingAndStatus(String title, String content, PostStatus status);

    // Per i moderatori: trova post pendenti
    List<Post> findByStatus(PostStatus status);
}

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {}

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
}

@Repository
public interface SupportRepository extends JpaRepository<Support, Long> {
    boolean existsByUserAndPost(User user, Post post);
}

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // Trova messaggi scambiati tra due utenti o ricevuti da un utente
    List<Message> findByReceiver_IdOrderByTimestampDesc(Long receiverId);
}