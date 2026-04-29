package com.quotation.system.domain.repository;

import com.quotation.system.domain.model.Client;
import java.util.List;
import java.util.Optional;

public interface ClientRepository {
    Client save(Client client);
    Optional<Client> findById(Long id);
    List<Client> findAll();
    void deleteById(Long id);
}
