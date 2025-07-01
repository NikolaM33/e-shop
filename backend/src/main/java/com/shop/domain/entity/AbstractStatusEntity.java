package com.shop.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.shop.domain.entity.AbstractEntity;
import com.shop.domain.entity.EntityStatus;

import lombok.Data;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotNull;


@Data
@ToString(callSuper = true, exclude = "entityStatus")
public abstract class AbstractStatusEntity extends AbstractEntity {

    private static final long serialVersionUID = 1L;

    public AbstractStatusEntity(){};

    public AbstractStatusEntity(EntityStatus entityStatus) {
        this.entityStatus = entityStatus;
    }

    @NotNull
    @Field(name = "entity_status")
    @JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
    private EntityStatus entityStatus;
}