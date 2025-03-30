package com.shop.repository.mongo.order;

import com.shop.domain.order.Order;
import com.shop.repository.AbstractMongoStatusEntityRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderMongoRepository extends AbstractMongoStatusEntityRepository<Order, String> {
}
