package com.shop.domain.dto.product;

import lombok.*;

import java.time.LocalDate;
import java.util.HashMap;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private String id;

    private String name;

    private String categoryId;

    private String subCategoryId;

    private Double price;

    private String code;

    private String description;

    private Integer quantity;

    private String brand;

    private String color;

    private String image1FileIdentifier;

    private String image2FileIdentifier;

    private String image3FileIdentifier;

    private String image4FileIdentifier;

    private String image5FileIdentifier;

    private String image6FileIdentifier;

    private HashMap<String,String> specifications;

    private boolean publish;

    private Integer discount;

    private String tagId;

    private LocalDate discountStartDate;

    private LocalDate discountEndDate;

    private String tagTitle;

    private Double priceWithDiscount;
}
