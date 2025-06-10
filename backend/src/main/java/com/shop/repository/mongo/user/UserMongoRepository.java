package com.shop.repository.mongo.user;

import com.shop.domain.entity.EntityStatus;
import com.shop.domain.user.User;
import com.shop.domain.user.UserType;
import com.shop.repository.AbstractMongoStatusEntityRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface UserMongoRepository extends AbstractMongoStatusEntityRepository<User,String> {

    Optional<User> findByEmailAndEntityStatus (String email, EntityStatus entityStatus);

    Page<User> findByUserTypeAndEntityStatus (UserType type, EntityStatus entityStatus, Pageable pageable);

    List<User> findTop10ByUserTypeAndEntityStatus(UserType type, EntityStatus entityStatus);

}
