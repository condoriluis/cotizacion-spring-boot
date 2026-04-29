package com.quotation.system.application.mapper;

import com.quotation.system.application.dto.ClientDTO;
import com.quotation.system.domain.model.Client;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientDTO toDto(Client client);
    Client toDomain(ClientDTO clientDTO);
    List<ClientDTO> toDtoList(List<Client> clients);
}
