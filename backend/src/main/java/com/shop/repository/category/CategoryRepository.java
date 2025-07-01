package com.shop.repository.category;

import com.shop.domain.category.Category;
import com.shop.domain.entity.EntityStatus;
import com.shop.repository.AbstractStatusEntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends AbstractStatusEntityRepository<Category, String> {

    Page<Category> findByEntityStatusAndNameLikeIgnoreCase(EntityStatus entityStatus, String name, Pageable pageable);
}
