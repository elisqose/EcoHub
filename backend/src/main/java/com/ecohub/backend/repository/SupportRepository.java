package com.ecohub.backend.repository;

import com.ecohub.backend.model.Post;
import com.ecohub.backend.model.Support;
import com.ecohub.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SupportRepository extends JpaRepository<Support, Long> {
    boolean existsByUserAndPost(User user, Post post);
    Optional<Support> findByUserAndPost(User user, Post post);
}