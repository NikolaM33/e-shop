package com.shop.domain.category;

import com.shop.domain.entity.AbstractStatusEntity;
import com.shop.domain.entity.mongo.AbstractMongoStatusEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.*;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
//@Table(name = "sub_category")
@Document(collection = "subcategories")
public class SubCategory extends AbstractMongoStatusEntity {

    private static final long serialVersionUID = 1L;

    @Column(name = "sub_category_name")
    private String name;

    @Column(name = "file_system_identifier", unique = true, length = 36)
    private String imageFileIdentifier;

    @Column(name = "image_type")
    private String imageType;

    @Column(name= "active")
    private Boolean active;

    @Column(name = "specification")
    private String specification;

    @DBRef
    private Category category;
}
