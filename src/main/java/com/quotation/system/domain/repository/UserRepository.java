package com.quotation.system.domain.repository;

import com.quotation.system.domain.model.User;
import java.util.Optional;

public interface UserRepository {
    User save(User user);
    Optional<User> findByUsername(String username);
    Optional<User> findById(Long id);
}
