package com.shop.repository.mongo.category;

import com.shop.domain.category.Category;
import com.shop.domain.entity.EntityStatus;
import com.shop.repository.AbstractMongoStatusEntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryMongoRepository extends AbstractMongoStatusEntityRepository<Category, String> {

    Page<Category> findByEntityStatusAndNameLikeIgnoreCase(EntityStatus entityStatus, String name, Pageable pageable);
}
