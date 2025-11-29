package com.ecohub.backend;

import com.ecohub.backend.model.*;
import com.ecohub.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private TagRepository tagRepository;

    @Override
    public void run(String... args) throws Exception {
        // Eseguiamo il caricamento dati solo se il database è vuoto
        if (userRepository.count() == 0) {
            System.out.println("--- INIZIO CARICAMENTO DATI DI TEST ---");

            // 1. CREAZIONE UTENTI
            // Utente Moderatore
            User admin = new User(null, "admin", "admin", "admin@ecohub.com", "Sono il moderatore del sistema.", UserRole.MODERATOR, null, null);

            // Utente Standard 1 (Mario)
            User mario = new User(null, "mario", "password", "mario@email.com", "Amo il giardinaggio urbano.", UserRole.STANDARD, null, null);

            // Utente Standard 2 (Luigi)
            User luigi = new User(null, "luigi", "password", "luigi@email.com", "Esperto di riciclo creativo.", UserRole.STANDARD, null, null);

            userRepository.saveAll(Arrays.asList(admin, mario, luigi));

            // 2. CREAZIONE TAG
            Tag tagEco = new Tag(null, "Ecologia");
            Tag tagRiciclo = new Tag(null, "Riciclo");
            Tag tagEventi = new Tag(null, "Eventi");
            Tag tagZeroWaste = new Tag(null, "ZeroWaste");

            tagRepository.saveAll(Arrays.asList(tagEco, tagRiciclo, tagEventi, tagZeroWaste));

            // 3. CREAZIONE POST

            // Post 1: Approvato (Visibile nella Home) - Scritto da Mario
            Post p1 = new Post(
                    null,
                    "Il mio orto urbano",
                    "Oggi ho finalmente piantato i pomodori sul balcone! È incredibile quanto spazio si possa recuperare verticalmente.",
                    "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8", // Immagine presa da Unsplash
                    LocalDateTime.now().minusDays(2), // Creato 2 giorni fa
                    PostStatus.APPROVED,
                    null,
                    mario,
                    null,
                    null,
                    List.of(tagEco, tagZeroWaste)
            );

            // Post 2: Approvato (Visibile nella Home) - Scritto da Luigi
            Post p2 = new Post(
                    null,
                    "Guida al riciclo della plastica",
                    "Non buttate i tappi delle bottiglie! Ecco come riutilizzarli per creare opere d'arte...",
                    null, // Nessuna immagine
                    LocalDateTime.now().minusHours(5),
                    PostStatus.APPROVED,
                    null,
                    luigi,
                    null,
                    null,
                    List.of(tagRiciclo)
            );

            // Post 3: In Attesa (Visibile solo al Moderatore) - Scritto da Mario
            Post p3 = new Post(
                    null,
                    "Organizzazione pulizia parco",
                    "Vorrei organizzare un evento domenica prossima. Chi ci sta?",
                    null,
                    LocalDateTime.now(),
                    PostStatus.PENDING,
                    null,
                    mario,
                    null,
                    null,
                    List.of(tagEventi, tagEco)
            );

            postRepository.saveAll(Arrays.asList(p1, p2, p3));

            System.out.println("--- DATI DI TEST CARICATI CORRETTAMENTE ---");
            System.out.println("Credenziali Moderatore -> User: admin | Pass: admin");
            System.out.println("Credenziali Standard   -> User: mario | Pass: password");
        }
    }
}