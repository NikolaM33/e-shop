package com.shop.domain.order.product;

import com.shop.domain.product.Product;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;

@Data
public class OrderProduct {

    @DBRef
    private Product product;

    private Integer quantity;

    private String size;

    private String color;

    private Double price;

    private String name;

    private String brand;

    private boolean discount;

    private Integer discountPercent;

    private Date rentStartDate;

    private Double rentDurationDays;
}
