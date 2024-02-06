package com.shop.repository;


import com.shop.domain.entity.EntityStatus;
import com.shop.domain.entity.mongo.AbstractMongoStatusEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface AbstractMongoStatusEntityRepository<T extends AbstractMongoStatusEntity, ID> extends MongoRepository<T, ID> {


    Page<T> findByEntityStatus(EntityStatus entityStatus, Pageable pageable);

    List<T> findByEntityStatus(EntityStatus entityStatus);

    Optional<T> findByIdAndEntityStatus(ID id, EntityStatus entityStatus);
}
