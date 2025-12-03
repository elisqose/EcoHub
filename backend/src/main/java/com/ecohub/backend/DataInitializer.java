package com.ecohub.backend;

import com.ecohub.backend.model.*;
import com.ecohub.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private PostRepository postRepository;
    @Autowired private TagRepository tagRepository;
    @Autowired private MessageRepository messageRepository;
    @Autowired private CommentRepository commentRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("--- INIZIO CARICAMENTO DATI ESTESI (UTENTI, POST, MESSAGGI, COMMENTI) ---");

            User admin = new User(null, "admin", "admin", "admin@ecohub.com",
                    "Moderatore ufficiale della piattaforma EcoHub.",
                    UserRole.MODERATOR,
                    "https://cdn-icons-png.flaticon.com/512/9703/9703596.png",
                    new ArrayList<>(), new ArrayList<>(), new ArrayList<>());

            User mario = new User(null, "mario", "password", "mario@email.com",
                    "Appassionato di orti urbani e biodiversità. Coltivo pomodori sul balcone!",
                    UserRole.STANDARD,
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                    new ArrayList<>(), new ArrayList<>(), new ArrayList<>());

            User luigi = new User(null, "luigi", "password", "luigi@email.com",
                    "Non si butta via niente! Esperto di upcycling e riparazioni fai-da-te.",
                    UserRole.STANDARD,
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                    new ArrayList<>(), new ArrayList<>(), new ArrayList<>());

            User giulia = new User(null, "giulia", "password", "giulia@email.com",
                    "Fashion designer etica. Amo i tessuti naturali e il vintage.",
                    UserRole.STANDARD,
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
                    new ArrayList<>(), new ArrayList<>(), new ArrayList<>());

            User sara = new User(null, "sara", "password", "sara@email.com",
                    "Vivo senza plastica dal 2020. Condivido consigli per ridurre i rifiuti.",
                    UserRole.STANDARD,
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
                    new ArrayList<>(), new ArrayList<>(), new ArrayList<>());

            User marco = new User(null, "marco", "password", "marco@email.com",
                    "Ingegnere ambientale. Parlo di rinnovabili e mobilità elettrica.",
                    UserRole.STANDARD,
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
                    new ArrayList<>(), new ArrayList<>(), new ArrayList<>());

            mario.getFollowing().addAll(Arrays.asList(luigi, giulia, sara));
            luigi.getFollowing().addAll(Arrays.asList(mario, marco));
            giulia.getFollowing().addAll(Arrays.asList(sara));
            sara.getFollowing().addAll(Arrays.asList(giulia, mario, marco));
            marco.getFollowing().addAll(Arrays.asList(luigi));

            userRepository.saveAll(Arrays.asList(admin, mario, luigi, giulia, sara, marco));

            Tag tagEco = new Tag(null, "Ecologia");
            Tag tagRiciclo = new Tag(null, "Riciclo");
            Tag tagEventi = new Tag(null, "Eventi");
            Tag tagZeroWaste = new Tag(null, "ZeroWaste");
            Tag tagModa = new Tag(null, "ModaEtica");
            Tag tagTech = new Tag(null, "TechGreen");
            Tag tagFood = new Tag(null, "CiboBio");

            tagRepository.saveAll(Arrays.asList(tagEco, tagRiciclo, tagEventi, tagZeroWaste, tagModa, tagTech, tagFood));

            List<Post> posts = new ArrayList<>();

            posts.add(new Post(null, "Il mio orto urbano cresce!",
                    "Quest'anno i pomodori sono esplosi. Ho usato solo compost fatto in casa.",
                    "https://images.unsplash.com/photo-1696087172662-65f7b09d614e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    LocalDateTime.now().minusDays(5), PostStatus.APPROVED, null,
                    mario, new ArrayList<>(), new ArrayList<>(), List.of(tagEco, tagFood)));

            posts.add(new Post(null, "Guida: Plastica vs Bioplastica",
                    "Facciamo chiarezza: la bioplastica va nell'umido solo se certificata compostabile.",
                    "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800",
                    LocalDateTime.now().minusDays(3), PostStatus.APPROVED, null,
                    luigi, new ArrayList<>(), new ArrayList<>(), List.of(tagRiciclo, tagEco)));

            posts.add(new Post(null, "Outfit 100% Second Hand",
                    "Non serve comprare nuovo per avere stile. Costo totale? 15 euro!",
                    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
                    LocalDateTime.now().minusDays(2), PostStatus.APPROVED, null,
                    giulia, new ArrayList<>(), new ArrayList<>(), List.of(tagModa, tagZeroWaste)));

            posts.add(new Post(null, "Spesa sfusa: come iniziare",
                    "Portatevi sempre i sacchetti di stoffa. Iniziate con frutta e verdura.",
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
                    LocalDateTime.now().minusHours(10), PostStatus.APPROVED, null,
                    sara, new ArrayList<>(), new ArrayList<>(), List.of(tagZeroWaste, tagFood)));

            posts.add(new Post(null, "Pannelli solari da balcone?",
                    "Sto testando un kit da 300W plug & play. Vi aggiornerò sui consumi.",
                    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
                    LocalDateTime.now().minusHours(2), PostStatus.APPROVED, null,
                    marco, new ArrayList<>(), new ArrayList<>(), List.of(tagTech, tagEco)));

            posts.add(new Post(null, "Organizzazione pulizia parco",
                    "Domenica prossima ci troviamo al Parco Sempione. Chi viene?",
                    null,
                    LocalDateTime.now(), PostStatus.PENDING, null,
                    mario, new ArrayList<>(), new ArrayList<>(), List.of(tagEventi, tagEco)));

            posts.add(new Post(null, "Vendo integratori",
                    "Contattatemi in privato.",
                    null,
                    LocalDateTime.now().minusMinutes(30), PostStatus.PENDING, null,
                    luigi, new ArrayList<>(), new ArrayList<>(), List.of(tagModa)));

            posts.add(new Post(null, "Come riciclare batterie",
                    "Le batterie vanno nel secco.",
                    null,
                    LocalDateTime.now().minusDays(1), PostStatus.REQUIRES_CHANGES,
                    "Info errata! Correggi indicando i contenitori RAEE.",
                    marco, new ArrayList<>(), new ArrayList<>(), List.of(tagRiciclo)));

            posts.add(new Post(null, "Odio il traffico!!!",
                    "Spero esplodano tutte le auto.",
                    null,
                    LocalDateTime.now().minusDays(10), PostStatus.REJECTED,
                    "Linguaggio violento.",
                    sara, new ArrayList<>(), new ArrayList<>(), List.of(tagEco)));

            postRepository.saveAll(posts);

            List<Comment> comments = new ArrayList<>();

            comments.add(new Comment(null, "Che belli! Che varietà sono?", LocalDateTime.now().minusDays(4), luigi, posts.get(0)));
            comments.add(new Comment(null, "Datterini, dolcissimi!", LocalDateTime.now().minusDays(4).plusHours(1), mario, posts.get(0)));
            comments.add(new Comment(null, "Wow, sembrano deliziosi 🍅", LocalDateTime.now().minusDays(3), sara, posts.get(0)));

            comments.add(new Comment(null, "Grazie per la chiarezza, sbagliavo sempre.", LocalDateTime.now().minusDays(2), giulia, posts.get(1)));
            comments.add(new Comment(null, "Esatto, il PLA va conferito correttamente.", LocalDateTime.now().minusDays(2), marco, posts.get(1)));

            comments.add(new Comment(null, "Adoro quella giacca!", LocalDateTime.now().minusDays(1), sara, posts.get(2)));

            commentRepository.saveAll(comments);

            List<Message> messages = new ArrayList<>();

            messages.add(new Message(null, "Ciao Mario! Per l'orto usi concime liquido?", LocalDateTime.now().minusDays(2), luigi, mario));

            messages.add(new Message(null, "Ciao! No, uso solo il compost che faccio io col bidone in balcone. Funziona alla grande.", LocalDateTime.now().minusDays(2).plusHours(2), mario, luigi));

            messages.add(new Message(null, "Ottimo, devo provare anche io. Grazie!", LocalDateTime.now().minusDays(2).plusHours(3), luigi, mario));

            messages.add(new Message(null, "Ciao Sara, dove compri i legumi sfusi a Milano?", LocalDateTime.now().minusDays(1), giulia, sara));

            messages.add(new Message(null, "Benvenuto su EcoHub Marco! 🌿\nSiamo felici di avere un ingegnere nel gruppo. Ricordati di leggere il regolamento prima di postare.", LocalDateTime.now().minusDays(5), admin, marco));

            messages.add(new Message(null, "⚠️ AVVISO MODERAZIONE\n\nIl tuo post 'Odio il traffico!!!' è stato rimosso perché violava le linee guida sulla comunicazione non violenta. Ti invitiamo a mantenere toni costruttivi.", LocalDateTime.now().minusDays(10), admin, sara));

            messages.add(new Message(null, "✏️ Il moderatore ha richiesto modifiche al tuo post 'Come riciclare batterie'.\n\nNota: Info errata! Correggi indicando i contenitori RAEE.", LocalDateTime.now().minusDays(1), admin, marco));

            messageRepository.saveAll(messages);

            System.out.println("--- DATI ESTESI COMPLETI CARICATI ---");
            System.out.println("Users: admin, mario, luigi, giulia, sara, marco");
            System.out.println("Password standard: 'password'");
        }
    }
}