package com.dvelupmint.app.repository;

import com.dvelupmint.app.model.Client;
import com.dvelupmint.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    boolean existsByEmail(String email);

    List<Client> findByOwner(User owner);
}