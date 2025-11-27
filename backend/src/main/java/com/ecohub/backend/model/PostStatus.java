package com.ecohub.backend.model;

public enum PostStatus {
    PENDING,          // In attesa di approvazione
    APPROVED,         // Visibile a tutti
    REQUIRES_CHANGES, // Rimandato all'autore per modifiche
    REJECTED          // Rifiutato definitivamente
}