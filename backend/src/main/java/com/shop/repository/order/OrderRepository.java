package com.shop.repository.order;

import com.shop.domain.entity.EntityStatus;
import com.shop.domain.order.Order;
import com.shop.domain.order.OrderStatus;
import com.shop.repository.AbstractStatusEntityRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends AbstractStatusEntityRepository<Order, String> {

    @Query("{ 'products.product.id' : ?0, 'status' : { $ne: ?1 }, " +
            "$or: [ " +
            "{ 'products.rentStartDate' : { $lt: ?2 }, 'products.rentEndDate' : { $gt: ?2 } }, " +
            "{ 'products.rentStartDate' : { $lt: ?3 }, 'products.rentEndDate' : { $gt: ?3 } }, " +
            "{ 'products.rentStartDate' : { $gte: ?2 }, 'products.rentEndDate' : { $lte: ?3 } }" +
            "] }")
    List<Order> findOrdersWithProductAndOverlappingDates(String productId, OrderStatus status, LocalDateTime startDate, LocalDateTime endDate);

    Page<Order> findByUserIdAndEntityStatus(String userId, EntityStatus entityStatus,Pageable pageable);
}
