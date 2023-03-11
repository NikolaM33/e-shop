package com.shop.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

/**
 * Abstract class that should be extended when child
 * entity need information provided by abstract entity class and can be logically deleted .
 *
 */
@MappedSuperclass
@Data
@ToString(callSuper = true, exclude = "entityStatus")
public abstract class AbstractStatusEntity extends AbstractEntity {

        private static final long serialVersionUID = 1L;
        public AbstractStatusEntity () {}

        public AbstractStatusEntity (EntityStatus entityStatus) {
                this.entityStatus = entityStatus;
        }

        @Column(name = "entity_status", nullable = false)
        @JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
        private EntityStatus entityStatus;
}

