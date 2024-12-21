package com.shop.domain.user;


import com.shop.domain.entity.mongo.AbstractMongoStatusEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;


@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Document(collection = "user")
public class User extends AbstractMongoStatusEntity {

    private static final long serialVersionUID = 1L;
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    @Indexed(unique = true)
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private UserType userType;

    private String getFullName (){
       return  this.firstName+ " "+ this.lastName;
    }
}
