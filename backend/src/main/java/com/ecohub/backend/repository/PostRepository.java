package com.ecohub.backend.repository;

import com.ecohub.backend.model.Post;
import com.ecohub.backend.model.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

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


