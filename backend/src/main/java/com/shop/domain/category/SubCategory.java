package com.shop.domain.category;

import com.shop.domain.entity.AbstractStatusEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@EqualsAndHashCode(callSuper = false)
@Document(collection = "subcategories")
public class SubCategory extends AbstractStatusEntity {

    private static final long serialVersionUID = 1L;

    private String name;

    private String imageFileIdentifier;

    private String imageType;

    private Boolean active;

    private String specification;

    @DBRef
    private Category category;
}
