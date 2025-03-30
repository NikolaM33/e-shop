package com.shop.domain.dto.order;


import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.Date;


@Data
public class OrderProductDTO {

    @NotNull
    private String productId;

    private Integer quantity;

    private String size;

    private String color;

    private Double price;

    private String name;

    private String brand;

    private boolean discount;

    private Integer discountPercent;

    private Date rentDateStart;

    private double rentDurationDays;

    private String image;
}
