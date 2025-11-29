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
}