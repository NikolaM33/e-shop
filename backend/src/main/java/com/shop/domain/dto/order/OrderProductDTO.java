package com.shop.domain.dto.order;


import lombok.Data;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;



@Data
public class OrderProductDTO {

    @NotNull
    private String productId;

    @Min(value = 1)
    private Integer quantity;

    private String size;

    private String color;

    private Double price;

    private String name;

    private String brand;

    private boolean discount;

    private Integer discountPercent;

    private LocalDate rentDateStart;

    private double rentDurationDays;

    private String image;
}
