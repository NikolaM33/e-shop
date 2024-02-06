package com.shop.repository.mongo.product;


import com.shop.domain.product.Product;
import com.shop.repository.AbstractMongoStatusEntityRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductMongoRepository extends AbstractMongoStatusEntityRepository<Product,String> {
}
