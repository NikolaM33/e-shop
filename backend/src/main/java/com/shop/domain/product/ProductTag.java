package com.shop.domain.product;


import com.shop.domain.entity.mongo.AbstractMongoStatusEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Entity;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Document(collection = "product_tags")
public class ProductTag extends AbstractMongoStatusEntity {

    private String title;
}
