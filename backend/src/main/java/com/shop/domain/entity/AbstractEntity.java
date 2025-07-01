package com.shop.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;

    @Data
    @ToString(of = "id")
    public  abstract class AbstractEntity implements Serializable {

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


