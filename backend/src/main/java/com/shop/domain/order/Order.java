package com.shop.domain.order;

import com.shop.domain.entity.AbstractStatusEntity;
import com.shop.domain.order.product.OrderProduct;
import com.shop.domain.user.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


import java.time.LocalDateTime;
import java.util.ArrayList;


@Data
@EqualsAndHashCode(callSuper = false)
@Document(collection = "order")
public class Order extends AbstractStatusEntity {

    private static final long serialVersionUID = 1L;

    @DBRef
    private User user;

    private String customerFirstName;

    private String customerLastName;

    private String customerPhone;

    private String customerEmail;

    private OrderType type;

    private String shippingAddress;

    private String shippingCounty;

    private String shippingState;

    private String shippingTown;

    private String shippingPostalCode;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private String paymentId;

    private Double amount;

    private OrderStatus status;

    private LocalDateTime paymentConfirmedAt;

    private ArrayList<OrderProduct> products;




}
