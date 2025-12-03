package com.ecohub.backend.repository;

import com.ecohub.backend.model.Post;
import com.ecohub.backend.model.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByStatusOrderByCreationDateDesc(PostStatus status);

    List<Post> findByTags_NameAndStatus(String tagName, PostStatus status);

    List<Post> findByAuthor_Id(Long userId);

    List<Post> findByTitleContainingOrContentContainingAndStatus(String title, String content, PostStatus status);

    List<Post> findByStatus(PostStatus status);
}


