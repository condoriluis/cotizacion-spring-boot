package com.quotation.system.infrastructure.persistence.mapper;

import com.quotation.system.domain.model.User;
import com.quotation.system.infrastructure.persistence.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserPersistenceMapper {
    UserEntity toEntity(User domain);
    User toDomain(UserEntity entity);
}
