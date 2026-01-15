package com.ecohub.backend.service;

import com.ecohub.backend.model.*;
import com.ecohub.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
        user.setFollowing(new java.util.ArrayList<>());
        user.setFollowers(new java.util.ArrayList<>());
        user.setReceivedMessages(new java.util.ArrayList<>());

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

    public User updateBio(Long userId, String newBio) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setBio(newBio);
        return userRepository.save(user);
    }

    public void unfollowUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId).orElseThrow();
        User followed = userRepository.findById(followedId).orElseThrow();

        if(follower.getFollowing().contains(followed)) {
            follower.getFollowing().remove(followed);
            userRepository.save(follower);
        }
    }

    public void removeFollower(Long userId, Long followerId) {
        User user = userRepository.findById(userId).orElseThrow();
        User followerToRemove = userRepository.findById(followerId).orElseThrow();

        if(followerToRemove.getFollowing().contains(user)) {
            followerToRemove.getFollowing().remove(user);
            userRepository.save(followerToRemove);
        }
    }

    public Message sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Mittente non trovato"));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Destinatario non trovato"));

        Message msg = new Message(null, content, LocalDateTime.now(), sender, receiver);
        return messageRepository.save(msg);
    }


    public List<Message> getInbox(Long userId) {
        return messageRepository.findByReceiver_IdOrderByTimestampDesc(userId);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Utente non trovato"));
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }

    public User updateProfilePicture(Long userId, String base64Image) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utente non trovato"));
        user.setProfilePicture(base64Image);
        return userRepository.save(user);
    }

    public void requestModeration(String username, String motivation) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utente non trovato: " + username));

        User admin = userRepository.findByUsername("admin")
                .orElseThrow(() -> new RuntimeException("Admin non trovato nel sistema"));

        String content = "RICHIESTA MODERATORE\n\nL'utente @" + username + " chiede di diventare moderatore.\n\nMotivazione:\n" + motivation;

        sendMessage(user.getId(), admin.getId(), content);
    }

    public void promoteToModerator(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utente non trovato: " + username));

        user.setRole(UserRole.MODERATOR);
        userRepository.save(user);

        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin != null) {
            sendMessage(admin.getId(), user.getId(), "✅ Congratulazioni! La tua richiesta è stata accettata. Ora sei un Moderatore.");
        }
    }

    public void rejectModeratorRequest(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utente non trovato: " + username));

        User admin = userRepository.findByUsername("admin")
                .orElseThrow(() -> new RuntimeException("Admin non trovato"));

        sendMessage(admin.getId(), user.getId(), "❌ Ciao " + username + ", ci dispiace informarti che la tua richiesta per diventare Moderatore non è stata accettata al momento.");
    }
}