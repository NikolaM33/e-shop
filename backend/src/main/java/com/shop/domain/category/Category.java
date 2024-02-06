package com.shop.domain.category;

import com.shop.domain.entity.mongo.AbstractMongoStatusEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Entity;


@Data
@EqualsAndHashCode(callSuper = false)
@Entity
//@Table(name = "category")
@Document(collection = "categories")
public class Category  extends AbstractMongoStatusEntity {

    private static final long serialVersionUID = 1L;


    private String  name;


    private String imageFileIdentifier;


    private String imageType;


    private Boolean active;


    private String specification;
}
