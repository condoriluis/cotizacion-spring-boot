package com.quotation.system.infrastructure.persistence.adapter;

import com.quotation.system.domain.model.User;
import com.quotation.system.domain.repository.UserRepository;
import com.quotation.system.infrastructure.persistence.mapper.UserPersistenceMapper;
import com.quotation.system.infrastructure.persistence.repository.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository userJpaRepository;
    private final UserPersistenceMapper userPersistenceMapper;

    @Override
    public User save(User user) {
        return userPersistenceMapper.toDomain(
                userJpaRepository.save(userPersistenceMapper.toEntity(user))
        );
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userJpaRepository.findByUsername(username)
                .map(userPersistenceMapper::toDomain);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userJpaRepository.findById(id)
                .map(userPersistenceMapper::toDomain);
    }
}
