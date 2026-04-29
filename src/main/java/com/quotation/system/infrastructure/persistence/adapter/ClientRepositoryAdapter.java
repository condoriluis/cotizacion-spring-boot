package com.quotation.system.infrastructure.persistence.adapter;

import com.quotation.system.domain.model.Client;
import com.quotation.system.domain.repository.ClientRepository;
import com.quotation.system.infrastructure.persistence.mapper.ClientPersistenceMapper;
import com.quotation.system.infrastructure.persistence.repository.ClientJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ClientRepositoryAdapter implements ClientRepository {

    private final ClientJpaRepository clientJpaRepository;
    private final ClientPersistenceMapper clientPersistenceMapper;

    @Override
    public Client save(Client client) {
        return clientPersistenceMapper.toDomain(
                clientJpaRepository.save(clientPersistenceMapper.toEntity(client))
        );
    }

    @Override
    public Optional<Client> findById(Long id) {
        return clientJpaRepository.findById(id)
                .map(clientPersistenceMapper::toDomain);
    }

    @Override
    public List<Client> findAll() {
        return clientPersistenceMapper.toDomainList(clientJpaRepository.findAll());
    }

    @Override
    public void deleteById(Long id) {
        clientJpaRepository.deleteById(id);
    }
}
