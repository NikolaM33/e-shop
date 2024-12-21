package com.shop.repository.mongo.user;

import com.shop.domain.entity.EntityStatus;
import com.shop.domain.user.User;
import com.shop.repository.AbstractMongoStatusEntityRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserMongoRepository extends AbstractMongoStatusEntityRepository<User,String> {

    Optional<User> findByEmailAndEntityStatus (String email, EntityStatus entityStatus);
}
