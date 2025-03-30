package com.shop.domain.product;

import com.shop.domain.category.Category;
import com.shop.domain.category.SubCategory;
import com.shop.domain.dto.product.Color;
import com.shop.domain.dto.product.ColorSizeMapping;
import com.shop.domain.dto.product.Size;
import com.shop.domain.entity.mongo.AbstractMongoStatusEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;


@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Document(collection = "product")
public class Product extends AbstractMongoStatusEntity {

    private static final long serialVersionUID = 1L;


    private String name;

    @DBRef
    private Category category;

    @DBRef
    private SubCategory subCategory;

    private Double price;

    private String code;

    private String description;

    private Integer quantity;

    private String brand;

    private String image1FileIdentifier;

    private String image2FileIdentifier;

    private String image3FileIdentifier;

    private String image4FileIdentifier;

    private String image5FileIdentifier;

    private String image6FileIdentifier;

    @Field("specification")
    private HashMap<String,String> specification;

    ProductState state;

    @DBRef
    private ProductTag tag;

    private Integer discount;

    private LocalDateTime discountStartDate;

    private LocalDateTime discountEndDate;

    private LocalDateTime publishedDate;

    private ArrayList<Size> sizes;

    private ArrayList<Color> colors;

    private ArrayList<ColorSizeMapping> sizeColorMapping;

    private ProductType type;



}
