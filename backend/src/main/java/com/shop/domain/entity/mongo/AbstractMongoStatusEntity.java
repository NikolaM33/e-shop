package com.shop.domain.entity.mongo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.shop.domain.entity.EntityStatus;
import com.sun.istack.NotNull;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.MappedSuperclass;

@MappedSuperclass
@Data
@ToString(callSuper = true, exclude = "entityStatus")
public abstract class AbstractMongoStatusEntity extends AbstractMongoEntity {

    private static final long serialVersionUID = 1L;

    public  AbstractMongoStatusEntity (){};

    public AbstractMongoStatusEntity (EntityStatus entityStatus) {
        this.entityStatus = entityStatus;
    }

    @NotNull
    @Field(name = "entity_status")
    @JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
    private EntityStatus entityStatus;
}