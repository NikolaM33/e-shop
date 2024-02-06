package com.shop.repository.jpa.category;


import com.shop.domain.category.SubCategory;
import com.shop.repository.AbstractStatusEntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubCategoryRepository
//        extends AbstractStatusEntityRepository<SubCategory,Long>
{


    @Query(value = "SELECT subcategory FROM SubCategory subcategory " +
            "WHERE subcategory.entityStatus = com.shop.domain.entity.EntityStatus.REGULAR " +
            "AND subcategory.category.entityStatus = com.shop.domain.entity.EntityStatus.REGULAR " +
            "AND (:filter IS NULL OR subcategory.name LIKE %:filter%)")
    Page<SubCategory> getSubCategories (@Param("filter") String filter, Pageable pageable);


    @Query(value = "SELECT subcategory FROM SubCategory subcategory WHERE subcategory.category.id=:categoryId " +
            "AND subcategory.category.entityStatus = com.shop.domain.entity.EntityStatus.REGULAR " +
            "AND subcategory.entityStatus = com.shop.domain.entity.EntityStatus.REGULAR ")
    List<SubCategory> findSubCategoryByCategoryId (@Param("categoryId") Long categoryId);
}
