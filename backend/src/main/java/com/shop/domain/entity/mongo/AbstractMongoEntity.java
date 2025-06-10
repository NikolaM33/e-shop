package com.shop.domain.entity.mongo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.istack.NotNull;
import lombok.Data;
import lombok.ToString;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.mongodb.core.mapping.Field;


import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;
import java.time.Instant;

    @MappedSuperclass
    @Data
    @EntityListeners(AuditingEntityListener.class)
    @ToString(of = "id")
    public  abstract class AbstractMongoEntity  implements Serializable {

        private static final long serialVersionUID = 1L;

        @Id
        private String id;

        @CreatedBy
        @Field(name = "created_by")
        @JsonIgnore
        private String createdBy;

        @CreatedDate
        @Field(name = "created_date")
        @JsonIgnore
        private Instant createdDate;

        @LastModifiedBy
        @Field(name = "last_modified_by")
        @JsonIgnore
        private String lastModifiedBy;

        @LastModifiedDate
        @Field(name = "last_modified_date")
        @JsonIgnore
        private Instant lastModifiedDate;

        @NotNull
        @JsonIgnore
        @Version
        private Long version;
    }


