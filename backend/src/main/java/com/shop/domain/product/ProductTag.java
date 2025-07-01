package com.shop.domain.product;


import com.shop.domain.entity.AbstractStatusEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@EqualsAndHashCode(callSuper = false)
@Document(collection = "product_tags")
public class ProductTag extends AbstractStatusEntity {

    private String title;
}
