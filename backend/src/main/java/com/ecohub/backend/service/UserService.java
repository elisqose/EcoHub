package com.ecohub.backend.service;

import com.ecohub.backend.model.*;
import com.ecohub.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    public User login(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password)
                .orElseThrow(() -> new RuntimeException("Credenziali non valide"));
    }

    public User register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username già utilizzato! Scegline un altro.");
        }
        user.setRole(UserRole.STANDARD);
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

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Utente non trovato"));
    }
}