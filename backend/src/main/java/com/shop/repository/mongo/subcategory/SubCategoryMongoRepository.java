package com.shop.repository.mongo.subcategory;


import com.shop.domain.category.SubCategory;
import com.shop.domain.entity.EntityStatus;
import com.shop.repository.AbstractMongoStatusEntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubCategoryMongoRepository  extends AbstractMongoStatusEntityRepository<SubCategory,String> {

    Page<SubCategory> findByEntityStatusAndNameLikeIgnoreCase(EntityStatus entityStatus, String name, Pageable pageable);

    List<SubCategory> findByCategory_IdAndEntityStatus(String categoryId, EntityStatus entityStatus);
}
