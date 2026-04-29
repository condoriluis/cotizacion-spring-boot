package com.quotation.system.infrastructure.persistence.mapper;

import com.quotation.system.domain.model.Client;
import com.quotation.system.infrastructure.persistence.entity.ClientEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClientPersistenceMapper {
    ClientEntity toEntity(Client domain);
    Client toDomain(ClientEntity entity);
    List<Client> toDomainList(List<ClientEntity> entities);
}
