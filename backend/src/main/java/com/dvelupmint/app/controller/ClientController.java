package com.dvelupmint.app.controller;

import com.dvelupmint.app.model.Client;
import com.dvelupmint.app.model.User;
import com.dvelupmint.app.repository.ClientRepository;
import com.dvelupmint.app.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientRepository clientRepo;

    @Autowired
    private UserRepository userRepo;

    public ClientController(ClientRepository clientRepo) {
        this.clientRepo = clientRepo;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Client>> getClients() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User currentUser = getCurrentUser(auth);

        List<Client> clients;
        if (currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            clients = clientRepo.findAll();
        } else {
            clients = clientRepo.findByOwner(currentUser);
        }

        if (clients.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(clients);
        }
        return ResponseEntity.ok(clients);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Optional<Client> optionalClient = clientRepo.findById(id);
        if (optionalClient.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Client client = optionalClient.get();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User currentUser = getCurrentUser(auth);

        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !client.getOwner().equals(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        return ResponseEntity.ok(client);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<?> addClient(@Valid @RequestBody Client client) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        User currentUser = getCurrentUser(auth);

        client.setOwner(currentUser);

        if (clientRepo.existsByEmail(client.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Client with email " + client.getEmail() + " already exists");
        }

        Client saved = clientRepo.save(client);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/batch")
    public ResponseEntity<?> addClients(@Valid @RequestBody List<Client> clients) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        User currentUser = getCurrentUser(auth);

        for (Client c : clients) {
            c.setOwner(currentUser);
            if (clientRepo.existsByEmail(c.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Duplicate email: " + c.getEmail());
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(clientRepo.saveAll(clients));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateClient(@PathVariable Long id, @Valid @RequestBody Client clientDetails) {
        Optional<Client> optional = clientRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        User currentUser = getCurrentUser(auth);

        Client existing = optional.get();

        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !existing.getOwner().equals(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only update your own clients");
        }

        if (!existing.getEmail().equals(clientDetails.getEmail()) &&
                clientRepo.existsByEmail(clientDetails.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already in use");
        }

        existing.setName(clientDetails.getName());
        existing.setEmail(clientDetails.getEmail());

        return ResponseEntity.ok(clientRepo.save(existing));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClient(@PathVariable Long id) {
        Optional<Client> optional = clientRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        User currentUser = getCurrentUser(auth);

        Client client = optional.get();

        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !client.getOwner().equals(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only delete your own clients");
        }

        clientRepo.deleteById(id);
        return ResponseEntity.ok("Client deleted");
    }

    // Avoids code duplication
    private User getCurrentUser(Authentication auth) {
        Object principal = auth.getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        } else {
            String email = auth.getName();
            return userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        }
    }
}