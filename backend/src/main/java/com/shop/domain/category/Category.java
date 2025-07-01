package com.shop.domain.category;

import com.shop.domain.entity.AbstractStatusEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@EqualsAndHashCode(callSuper = false)
@Document(collection = "categories")
public class Category  extends AbstractStatusEntity {

    private static final long serialVersionUID = 1L;


    private String  name;


    private String imageFileIdentifier;


    private String imageType;


    private Boolean active;


    private String specification;
}
