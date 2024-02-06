package com.shop.repository.jpa.category;

import com.shop.domain.category.Category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



@Repository
public interface CategoryRepository
//        extends AbstractStatusEntityRepository<Category,Long>
{


    @Query(value = "SELECT category FROM Category category " +
            "WHERE category.entityStatus = com.shop.domain.entity.EntityStatus.REGULAR " +
            "AND (:filter IS NULL OR category.name LIKE %:filter%)")
    Page<Category> getCategories (@Param("filter") String filter, Pageable pageable);

}
