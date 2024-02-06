package com.shop.repository.jpa.user;

import com.shop.domain.entity.EntityStatus;
import com.shop.domain.user.User;
import com.shop.repository.AbstractStatusEntityRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends AbstractStatusEntityRepository<User,Long> {

    Optional<User> findByEmailAndEntityStatus (String email, EntityStatus entityStatus);
}
