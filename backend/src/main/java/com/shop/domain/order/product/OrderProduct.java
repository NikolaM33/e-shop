package com.shop.domain.order.product;

import com.shop.domain.product.Product;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDate;
import java.time.LocalDateTime;


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

    private LocalDate rentStartDate;

    private LocalDateTime rentEndDate;

    private Double rentDurationDays;
}
