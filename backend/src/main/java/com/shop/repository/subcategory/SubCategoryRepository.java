package com.shop.repository.subcategory;


import com.shop.domain.category.SubCategory;
import com.shop.domain.entity.EntityStatus;
import com.shop.repository.AbstractStatusEntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubCategoryRepository extends AbstractStatusEntityRepository<SubCategory, String> {

    Page<SubCategory> findByEntityStatusAndNameLikeIgnoreCase(EntityStatus entityStatus, String name, Pageable pageable);

    List<SubCategory> findByCategoryIdAndEntityStatus(String categoryId, EntityStatus entityStatus);
}
