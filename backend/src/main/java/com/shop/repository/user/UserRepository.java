package com.shop.repository.user;

import com.shop.domain.user.User;
import com.shop.repository.AbstractStatusEntityRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends AbstractStatusEntityRepository<User,Long> {
}
