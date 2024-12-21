package com.shop.repository.mongo.product;


import com.shop.domain.entity.EntityStatus;
import com.shop.domain.product.Product;
import com.shop.domain.product.ProductState;
import com.shop.repository.AbstractMongoStatusEntityRepository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProductMongoRepository extends AbstractMongoStatusEntityRepository<Product, String> {


    @Query("{ 'state': ?0, 'entityStatus': ?1 }")
    List<Product> findTop20ByStateAndEntityStatusOrderByPublishedDateDesc(ProductState state, EntityStatus entityStatus);

    @Query("{ 'category': { '$ref': 'categories', '$id': ?0 }, 'state': 'PUBLISHED', 'entity_status': 'REGULAR' }")
    List<Product> findTop10ByCategoryIdAndStatePublishedAndStatusRegular(ObjectId categoryId);


}
