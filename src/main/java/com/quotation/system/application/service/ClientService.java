package com.quotation.system.application.service;

import com.quotation.system.application.dto.ClientDTO;
import com.quotation.system.application.mapper.ClientMapper;
import com.quotation.system.domain.model.Client;
import com.quotation.system.domain.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    public ClientDTO create(ClientDTO clientDTO) {
        Client client = clientMapper.toDomain(clientDTO);
        return clientMapper.toDto(clientRepository.save(client));
    }

    public ClientDTO update(Long id, ClientDTO clientDTO) {
        return clientRepository.findById(id)
                .map(existing -> {
                    Client updated = clientMapper.toDomain(clientDTO);
                    updated.setId(id);
                    return clientMapper.toDto(clientRepository.save(updated));
                })
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<ClientDTO> findAll() {
        return clientMapper.toDtoList(clientRepository.findAll());
    }

    @Transactional(readOnly = true)
    public ClientDTO findById(Long id) {
        return clientRepository.findById(id)
                .map(clientMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    public void delete(Long id) {
        clientRepository.deleteById(id);
    }
}
